import { renderEmailShell } from '@/lib/email/layout'

export interface EmailTemplateProps {
  name: string
  renewalTitle: string
  category: string
  frequency: string
  dueDate: string
  amount: string
  ctaUrl: string
  daysLeft?: number
  daysOverdue?: number
  oldDate?: string
}

export interface RenderedEmail {
  subject: string
  html: string
}

/* ── Template 1 — Recurring, Upcoming ───────────────────────────────────── */
export function template1Recurring(p: EmailTemplateProps): RenderedEmail {
  return {
    subject: `${p.name}, your ${p.renewalTitle} renews in ${p.daysLeft} days`,
    html: renderEmailShell({
      greeting: `Hi ${p.name},`,
      intro: `Just a heads-up from your renewal desk.<br><br>Your <strong>${p.renewalTitle}</strong> (${p.category}) is set to renew automatically in ${p.daysLeft} days. No panic — just making sure you're aware and your payment method is ready.`,
      rows: [
        ['🔄 Type', `Recurring (${p.frequency})`],
        ['📅 Next Renewal', p.dueDate],
        ['💰 Amount', p.amount],
      ],
      bodyAfterRows: `If anything has changed — card details, pricing, or you want to cancel — now is the right time to act.`,
      ctaLabel: 'Review Renewal →',
      ctaUrl: p.ctaUrl,
      signoff: `We'll keep watching so you never miss a beat.`,
    }),
  }
}

/* ── Template 2A — One-Time, Intent: Renew, Upcoming ────────────────────── */
export function template2aOneTimeRenew(p: EmailTemplateProps): RenderedEmail {
  return {
    subject: `${p.name}, your ${p.renewalTitle} is due for renewal in ${p.daysLeft} days`,
    html: renderEmailShell({
      greeting: `Hi ${p.name},`,
      intro: `Your <strong>${p.renewalTitle}</strong> (${p.category}) is coming up for renewal in ${p.daysLeft} days.<br><br>This won't renew automatically — you'll need to take action to keep it active.`,
      rows: [
        ['📋 Type', 'One-Time'],
        ['📅 Due Date', p.dueDate],
        ['💰 Amount', p.amount],
      ],
      bodyAfterRows: `Don't let it lapse. Renew before ${p.dueDate} to stay covered.`,
      ctaLabel: 'Renew Now →',
      ctaUrl: p.ctaUrl,
      signoff: `Small actions today prevent big problems tomorrow.`,
    }),
  }
}

/* ── Template 2B — One-Time, Intent: Cancel, Upcoming ───────────────────── */
export function template2bOneTimeCancel(p: EmailTemplateProps): RenderedEmail {
  return {
    subject: `${p.name}, your ${p.renewalTitle} renews in ${p.daysLeft} days — cancel before then?`,
    html: renderEmailShell({
      greeting: `Hi ${p.name},`,
      intro: `You marked <strong>${p.renewalTitle}</strong> (${p.category}) as something you want to cancel before it charges you again.<br><br>You have ${p.daysLeft} days to act — cancel now to avoid being charged on ${p.dueDate}.`,
      rows: [
        ['📋 Type', 'One-Time'],
        ['📅 Renewal Date', p.dueDate],
        ['💰 Amount at Risk', p.amount],
      ],
      bodyAfterRows: `Don't wait until the last minute. Cancel directly with your provider, then mark it as done in RenewalGuard.`,
      ctaLabel: 'Mark as Cancelled →',
      ctaUrl: p.ctaUrl,
      signoff: `Stay in control of your money.`,
    }),
  }
}

/* ── Template 3 — Recurring, Auto-Rolled ────────────────────────────────── */
export function template3AutoRolled(p: EmailTemplateProps): RenderedEmail {
  return {
    subject: `${p.name}, your ${p.renewalTitle} renewal date has been updated`,
    html: renderEmailShell({
      greeting: `Hi ${p.name},`,
      intro: `Just keeping you in the loop.<br><br>Your <strong>${p.renewalTitle}</strong> (${p.frequency}) passed its renewal date — we've automatically moved it forward to your next cycle so your dashboard stays clean and accurate.`,
      rows: [
        ['🔄 Frequency', p.frequency],
        ['✅ Previous Due', p.oldDate ?? '—'],
        ['📅 Next Due', p.dueDate],
        ['💰 Amount', p.amount],
      ],
      bodyAfterRows: `No action needed — unless something has changed on your end.`,
      ctaLabel: 'View Renewal →',
      ctaUrl: p.ctaUrl,
      signoff: `We'll remind you again as the next date approaches.`,
    }),
  }
}

/* ── Template 4 — Final Reminder, 1 Day Left (overrides all others) ────── */
export function template4FinalReminder(p: EmailTemplateProps): RenderedEmail {
  return {
    subject: `${p.name}, ${p.renewalTitle} is due tomorrow`,
    html: renderEmailShell({
      greeting: `Hi ${p.name},`,
      intro: `This is your final reminder.<br><br><strong>${p.renewalTitle}</strong> (${p.category}) is due tomorrow, ${p.dueDate}. After this, we won't be able to help you avoid the consequences of missing it.`,
      rows: [
        ['📋 Category', p.category],
        ['📅 Due', `Tomorrow — ${p.dueDate}`],
        ['💰 Amount', p.amount],
      ],
      bodyAfterRows: `Whatever you need to do — renew, cancel, or confirm — do it today.`,
      ctaLabel: 'Take Action Now →',
      ctaUrl: p.ctaUrl,
      signoff: `This is what RenewalGuard is for.`,
    }),
  }
}

/* ── Template 2C — One-Time, Overdue (day 5 / 10 / 15) ──────────────────── */
export function template2cOneTimeOverdue(p: EmailTemplateProps): RenderedEmail {
  return {
    subject: `${p.name}, your ${p.renewalTitle} is ${p.daysOverdue} days overdue`,
    html: renderEmailShell({
      greeting: `Hi ${p.name},`,
      intro: `Your <strong>${p.renewalTitle}</strong> (${p.category}) was due on ${p.dueDate} — that's ${p.daysOverdue} days ago and it's still unresolved in your dashboard.<br><br>We don't know if you renewed, cancelled, or it slipped through the cracks. Help us keep your records accurate.`,
      rows: [],
      bodyAfterRows: `
        <strong>What happened?</strong>
        <ul style="padding-left:20px;line-height:1.6;">
          <li>✅ Mark as Renewed — I paid, it's active</li>
          <li>❌ Mark as Cancelled — I cancelled it successfully</li>
          <li>✏️ Edit the Date — it got pushed back</li>
          <li>🗄️ Archive It — no longer relevant</li>
        </ul>`,
      ctaLabel: 'Resolve This Now →',
      ctaUrl: p.ctaUrl,
      signoff: `A clean dashboard is a sharp dashboard.`,
    }),
  }
}

/* ── Template 5 — Recurring, Overdue failsafe (auto-roll may have failed) ─ */
export function template5RecurringOverdueFailsafe(p: EmailTemplateProps): RenderedEmail {
  return {
    subject: `${p.name}, please check your ${p.renewalTitle} renewal`,
    html: renderEmailShell({
      greeting: `Hi ${p.name},`,
      intro: `Your <strong>${p.renewalTitle}</strong> (${p.frequency}) was due on ${p.dueDate} and we noticed it hasn't updated in your dashboard yet.<br><br>This could mean your renewal didn't process, or something needs your attention.`,
      rows: [
        ['🔄 Frequency', p.frequency],
        ['📅 Was Due', p.dueDate],
        ['💰 Amount', p.amount],
      ],
      bodyAfterRows: `Take 30 seconds to check and confirm everything is in order.`,
      ctaLabel: 'Check My Renewal →',
      ctaUrl: p.ctaUrl,
      signoff: `We've got your back — but this one needs your eyes.`,
    }),
  }
}
