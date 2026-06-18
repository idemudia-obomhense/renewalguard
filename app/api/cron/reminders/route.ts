import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { format, parseISO } from 'date-fns'
import { createServiceClient } from '@/lib/supabase/server'
import { toISODateString, today } from '@/lib/utils/date'
import { formatAmount, formatCategoryLabel, formatFrequencyLabel, getFirstName } from '@/lib/utils/format'
import { rollOverdueRenewals, findAndMarkOverdueEscalations, type RolledRenewal, type OverdueEscalationCandidate } from '@/lib/reminders'
import { selectUpcomingTemplate } from '@/lib/email/select-template'
import { template3AutoRolled, template2cOneTimeOverdue, template5RecurringOverdueFailsafe, type EmailTemplateProps, type RenderedEmail } from '@/lib/email/templates'
import type { Renewal } from '@/types'

const FROM_EMAIL = process.env.REMINDER_FROM_EMAIL ?? 'RenewalGuard <onboarding@resend.dev>'

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

interface DueReminder {
  id: string
  renewal_id: string
  days_before: number
  renewals: Renewal | null
}

interface RecipientContext {
  email: string
  name: string
}

async function getRecipientContext(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  userId: string,
): Promise<RecipientContext | null> {
  const [{ data: userData }, { data: profile }] = await Promise.all([
    supabase.auth.admin.getUserById(userId),
    supabase.from('profiles').select('full_name').eq('id', userId).single(),
  ])
  const email = userData?.user?.email
  if (!email) return null
  return { email, name: getFirstName(profile?.full_name ?? '') }
}

async function sendTemplateEmail(
  resend: Resend,
  recipient: RecipientContext,
  rendered: RenderedEmail,
): Promise<void> {
  const { error } = await resend.emails.send({
    from:    FROM_EMAIL,
    to:      recipient.email,
    subject: rendered.subject,
    html:    rendered.html,
  })
  if (error) throw new Error(error.message)
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not configured.' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = await createServiceClient()

  /* ── Pass 1: upcoming reminders (Templates 1, 2A, 2B, 4) ────────────── */

  const { data: dueReminders, error } = await supabase
    .from('reminders')
    .select('id, renewal_id, days_before, renewals(*)')
    .eq('status', 'pending')
    .lte('scheduled_date', toISODateString(today()))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  let failed = 0

  for (const reminder of (dueReminders ?? []) as unknown as DueReminder[]) {
    const renewal = reminder.renewals
    if (!renewal) {
      await supabase
        .from('reminders')
        .update({ status: 'failed', error_msg: 'Renewal not found.' })
        .eq('id', reminder.id)
      failed++
      continue
    }

    try {
      const recipient = await getRecipientContext(supabase, renewal.user_id)
      if (!recipient) throw new Error('Could not resolve recipient email.')

      const props: EmailTemplateProps = {
        name:         recipient.name,
        renewalTitle: renewal.title,
        category:     formatCategoryLabel(renewal.category),
        frequency:    formatFrequencyLabel(renewal.frequency),
        dueDate:      format(parseISO(renewal.renewal_date), 'MMMM d, yyyy'),
        amount:       formatAmount(renewal.amount, renewal.currency),
        ctaUrl:       `${getSiteUrl()}/renewals/${renewal.id}`,
        daysLeft:     reminder.days_before,
      }
      const rendered = selectUpcomingTemplate(renewal.frequency, renewal.intent, reminder.days_before, props)
      await sendTemplateEmail(resend, recipient, rendered)

      await supabase
        .from('reminders')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', reminder.id)

      await supabase.from('notifications').insert({
        user_id:    renewal.user_id,
        renewal_id: renewal.id,
        type:       'reminder_sent',
        title:      'Renewal reminder sent',
        message:    `${renewal.title} renews ${reminder.days_before === 1 ? 'tomorrow' : `in ${reminder.days_before} days`}.`,
      })

      sent++
    } catch (err) {
      failed++
      await supabase
        .from('reminders')
        .update({
          status:    'failed',
          error_msg: err instanceof Error ? err.message : 'Unknown error',
        })
        .eq('id', reminder.id)
    }
  }

  /* ── Pass 2: roll overdue recurring renewals forward (Template 3) ───── */

  const rolled = await rollOverdueRenewals(supabase)
  let autoRollEmailsSent = 0

  for (const renewal of rolled as RolledRenewal[]) {
    try {
      const recipient = await getRecipientContext(supabase, renewal.user_id)
      if (!recipient) continue

      const props: EmailTemplateProps = {
        name:         recipient.name,
        renewalTitle: renewal.title,
        category:     '',
        frequency:    formatFrequencyLabel(renewal.frequency),
        dueDate:      format(parseISO(renewal.newDate), 'MMMM d, yyyy'),
        amount:       formatAmount(renewal.amount, renewal.currency),
        ctaUrl:       `${getSiteUrl()}/renewals/${renewal.id}`,
        oldDate:      format(parseISO(renewal.oldDate), 'MMMM d, yyyy'),
      }
      await sendTemplateEmail(resend, recipient, template3AutoRolled(props))
      autoRollEmailsSent++
    } catch (err) {
      console.error(`[cron] Failed to send auto-roll email for renewal ${renewal.id}:`, err)
    }
  }

  /* ── Pass 3: overdue escalation (Templates 2C, 5) ────────────────────── */

  const overdueCandidates = await findAndMarkOverdueEscalations(supabase)
  let overdueEmailsSent = 0

  for (const candidate of overdueCandidates as OverdueEscalationCandidate[]) {
    try {
      const recipient = await getRecipientContext(supabase, candidate.user_id)
      if (!recipient) continue

      const props: EmailTemplateProps = {
        name:         recipient.name,
        renewalTitle: candidate.title,
        category:     formatCategoryLabel(candidate.category),
        frequency:    formatFrequencyLabel(candidate.frequency),
        dueDate:      format(parseISO(candidate.renewal_date), 'MMMM d, yyyy'),
        amount:       formatAmount(candidate.amount, candidate.currency),
        ctaUrl:       `${getSiteUrl()}/renewals/${candidate.id}`,
        daysOverdue:  candidate.daysOverdue,
      }
      const rendered = candidate.template === '2c' ? template2cOneTimeOverdue(props) : template5RecurringOverdueFailsafe(props)
      await sendTemplateEmail(resend, recipient, rendered)
      overdueEmailsSent++
    } catch (err) {
      console.error(`[cron] Failed to send overdue escalation email for renewal ${candidate.id}:`, err)
    }
  }

  return NextResponse.json({
    processed: (dueReminders ?? []).length,
    sent,
    failed,
    rolled: rolled.length,
    autoRollEmailsSent,
    overdueEmailsSent,
  })
}
