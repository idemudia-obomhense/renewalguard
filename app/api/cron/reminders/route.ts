import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { format, parseISO } from 'date-fns'
import { createServiceClient } from '@/lib/supabase/server'
import { toISODateString, today } from '@/lib/utils/date'
import { formatAmount, formatCategoryLabel } from '@/lib/utils/format'
import { rollOverdueRenewals } from '@/lib/reminders'
import type { Renewal } from '@/types'

const FROM_EMAIL = process.env.REMINDER_FROM_EMAIL ?? 'RenewalGuard <onboarding@resend.dev>'

interface DueReminder {
  id: string
  renewal_id: string
  days_before: number
  renewals: Renewal | null
}

function dueLabel(daysBefore: number): string {
  if (daysBefore === 1) return 'tomorrow'
  return `in ${daysBefore} days`
}

function reminderEmailHtml(renewal: Renewal, daysBefore: number): string {
  const renewalDate = format(parseISO(renewal.renewal_date), 'MMMM d, yyyy')
  return `
    <p>Hi,</p>
    <p><strong>${renewal.title}</strong> (${formatCategoryLabel(renewal.category)}) renews on
    <strong>${renewalDate}</strong> — that's ${dueLabel(daysBefore)}.</p>
    ${renewal.amount != null ? `<p>Amount: ${formatAmount(renewal.amount, renewal.currency)}</p>` : ''}
    <p>— RenewalGuard</p>
  `
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
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(renewal.user_id)
      const email = userData?.user?.email
      if (userError || !email) throw new Error('Could not resolve recipient email.')

      const { error: sendError } = await resend.emails.send({
        from:    FROM_EMAIL,
        to:      email,
        subject: `Reminder: ${renewal.title} renews ${dueLabel(reminder.days_before)}`,
        html:    reminderEmailHtml(renewal, reminder.days_before),
      })
      if (sendError) throw new Error(sendError.message)

      await supabase
        .from('reminders')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', reminder.id)

      await supabase.from('notifications').insert({
        user_id:    renewal.user_id,
        renewal_id: renewal.id,
        type:       'reminder_sent',
        title:      'Renewal reminder sent',
        message:    `${renewal.title} renews ${dueLabel(reminder.days_before)}.`,
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

  const rolled = await rollOverdueRenewals(supabase)

  return NextResponse.json({ processed: (dueReminders ?? []).length, sent, failed, rolled: rolled.length })
}
