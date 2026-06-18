import { createClient } from '@/lib/supabase/server'
import { getReminderDate, getNextRenewalDate, getDaysRemaining, toISODateString, today } from '@/lib/utils/date'
import type { RenewalCategory, RenewalFrequency } from '@/types'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * Reminders are rows in their own table (picked up by the email cron job),
 * not derived from renewals.reminder_days at send time. Re-sync them
 * whenever a renewal's date/reminder_days change, or whenever it stops
 * being active, so the cron never emails about a stale or inactive renewal.
 */
export async function syncPendingReminders(
  supabase: SupabaseServerClient,
  renewalId: string,
  renewalDate: string,
  reminderDays: number[],
): Promise<void> {
  await supabase.from('reminders').delete().eq('renewal_id', renewalId).eq('status', 'pending')

  if (reminderDays.length === 0) return

  const rows = reminderDays.map(days => ({
    renewal_id:     renewalId,
    days_before:    days,
    scheduled_date: getReminderDate(renewalDate, days),
  }))

  await supabase.from('reminders').insert(rows)
}

export async function cancelPendingReminders(supabase: SupabaseServerClient, renewalId: string): Promise<void> {
  await supabase
    .from('reminders')
    .update({ status: 'cancelled' })
    .eq('renewal_id', renewalId)
    .eq('status', 'pending')
}

const MAX_ROLL_ITERATIONS = 1000 // defensive cap; a monthly renewal missed for 10 years is ~120 iterations

export interface RolledRenewal {
  id: string
  title: string
  oldDate: string
  newDate: string
  frequency: RenewalFrequency
  amount: number | null
  currency: string | null
  user_id: string
}

/**
 * Rolls overdue, active, non-one-time renewals forward to the next future
 * cycle and re-syncs their reminders. One-time renewals are left overdue on
 * purpose so the user still sees and acts on them.
 */
export async function rollOverdueRenewals(supabase: SupabaseServerClient): Promise<RolledRenewal[]> {
  const todayStr = toISODateString(today())

  const { data: overdueRenewals } = await supabase
    .from('renewals')
    .select('id, title, renewal_date, frequency, reminder_days, user_id, amount, currency')
    .eq('status', 'active')
    .is('deleted_at', null)
    .neq('frequency', 'one_time')
    .lt('renewal_date', todayStr)

  const rolled: RolledRenewal[] = []

  for (const renewal of overdueRenewals ?? []) {
    try {
      let newDate = renewal.renewal_date
      let iterations = 0
      while (newDate < todayStr && iterations < MAX_ROLL_ITERATIONS) {
        newDate = getNextRenewalDate(newDate, renewal.frequency)
        iterations++
      }
      if (newDate === renewal.renewal_date) continue // cap hit without progress — skip, don't loop forever

      // Re-check status + old date at write time (not just at the initial SELECT) so a
      // concurrent cron run that already rolled this renewal can't double-roll it: if
      // another run already updated renewal_date to >= today, this WHERE clause matches
      // zero rows and .length will be 0 below.
      const { data: updated } = await supabase
        .from('renewals')
        .update({ renewal_date: newDate, overdue_emails_sent: 0, last_overdue_email_sent_at: null })
        .eq('id', renewal.id)
        .eq('status', 'active')
        .lt('renewal_date', todayStr)
        .select('id')

      if (!updated || updated.length === 0) continue

      await syncPendingReminders(supabase, renewal.id, newDate, renewal.reminder_days)

      await supabase.from('renewal_activity_log').insert({
        renewal_id: renewal.id,
        user_id:    renewal.user_id,
        event_type: 'edited',
        metadata:   { reason: 'auto_roll', old_date: renewal.renewal_date, new_date: newDate, frequency: renewal.frequency },
      })

      console.log(`[cron] Rolled "${renewal.title}" forward: ${renewal.renewal_date} -> ${newDate} (${renewal.frequency})`)
      rolled.push({
        id:        renewal.id,
        title:     renewal.title,
        oldDate:   renewal.renewal_date,
        newDate,
        frequency: renewal.frequency,
        amount:    renewal.amount,
        currency:  renewal.currency,
        user_id:   renewal.user_id,
      })
    } catch (err) {
      console.error(`[cron] Failed to roll renewal ${renewal.id}:`, err)
    }
  }

  return rolled
}

export interface OverdueEscalationCandidate {
  id: string
  title: string
  category: RenewalCategory
  frequency: RenewalFrequency
  renewal_date: string
  amount: number | null
  currency: string | null
  user_id: string
  daysOverdue: number
  template: '2c' | '5'
}

/**
 * One-time overdue renewals escalate up to 3 times (day 5/10/15); recurring
 * renewals still overdue at this point mean rollOverdueRenewals already ran
 * this request and failed to roll them, so they get a single failsafe email
 * (template 5). Thresholds are checked as "daysOverdue >= next threshold"
 * rather than an exact day match, so a missed cron run still catches up
 * instead of permanently skipping that escalation step.
 */
export async function findAndMarkOverdueEscalations(
  supabase: SupabaseServerClient,
): Promise<OverdueEscalationCandidate[]> {
  const todayStr = toISODateString(today())

  const { data: overdueRenewals } = await supabase
    .from('renewals')
    .select(
      'id, title, category, frequency, renewal_date, amount, currency, user_id, overdue_emails_sent, last_overdue_email_sent_at',
    )
    .eq('status', 'active')
    .is('deleted_at', null)
    .lt('renewal_date', todayStr)

  const candidates: OverdueEscalationCandidate[] = []

  for (const renewal of overdueRenewals ?? []) {
    const sentToday =
      renewal.last_overdue_email_sent_at &&
      toISODateString(new Date(renewal.last_overdue_email_sent_at)) === todayStr
    if (sentToday) continue

    const isOneTime = renewal.frequency === 'one_time'
    const thresholds = isOneTime ? [5, 10, 15] : [5]
    const cap = thresholds.length
    if (renewal.overdue_emails_sent >= cap) continue

    const daysOverdue = -getDaysRemaining(renewal.renewal_date)
    const nextThreshold = thresholds[renewal.overdue_emails_sent]
    if (daysOverdue < nextThreshold) continue

    // Re-check the counter at write time (optimistic concurrency, same
    // pattern as rollOverdueRenewals) so a concurrent cron run can't
    // double-send the same escalation step.
    const { data: updated } = await supabase
      .from('renewals')
      .update({ overdue_emails_sent: renewal.overdue_emails_sent + 1, last_overdue_email_sent_at: new Date().toISOString() })
      .eq('id', renewal.id)
      .eq('status', 'active')
      .eq('overdue_emails_sent', renewal.overdue_emails_sent)
      .select('id')

    if (!updated || updated.length === 0) continue

    candidates.push({
      id:           renewal.id,
      title:        renewal.title,
      category:     renewal.category,
      frequency:    renewal.frequency,
      renewal_date: renewal.renewal_date,
      amount:       renewal.amount,
      currency:     renewal.currency,
      user_id:      renewal.user_id,
      daysOverdue,
      template: isOneTime ? '2c' : '5',
    })
  }

  return candidates
}
