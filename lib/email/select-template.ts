import {
  template1Recurring,
  template2aOneTimeRenew,
  template2bOneTimeCancel,
  template4FinalReminder,
  type EmailTemplateProps,
  type RenderedEmail,
} from '@/lib/email/templates'
import type { RenewalFrequency, RenewalIntent } from '@/types'

/**
 * Decision tree for "upcoming" reminders (everything except auto-roll and
 * overdue escalation, which are driven by a single upstream condition and
 * don't need a selector). daysLeft === 1 overrides type/intent entirely.
 * Any other daysLeft value (0, 3, 7, 14, 30, 60, 90 — whatever the user
 * configured) routes through the same recurring/renew/cancel branch.
 */
export function selectUpcomingTemplate(
  frequency: RenewalFrequency,
  intent: RenewalIntent | null,
  daysLeft: number,
  props: EmailTemplateProps,
): RenderedEmail {
  if (daysLeft === 1) return template4FinalReminder(props)
  if (frequency !== 'one_time') return template1Recurring(props)
  return intent === 'cancel' ? template2bOneTimeCancel(props) : template2aOneTimeRenew(props)
}
