import { createClient } from '@/lib/supabase/server'
import { getReminderDate, getNextRenewalDate, toISODateString, today } from '@/lib/utils/date'
import type { RenewalFrequency } from '@/types'

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
    .select('id, title, renewal_date, frequency, reminder_days, user_id')
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
        .update({ renewal_date: newDate })
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
      rolled.push({ id: renewal.id, title: renewal.title, oldDate: renewal.renewal_date, newDate, frequency: renewal.frequency })
    } catch (err) {
      console.error(`[cron] Failed to roll renewal ${renewal.id}:`, err)
    }
  }

  return rolled
}
