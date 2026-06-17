import { differenceInCalendarDays, parseISO, format, addMonths, addYears, addDays } from 'date-fns'
import type { DateFormat, Renewal, RenewalFrequency, RenewalUrgency } from '@/types'
import { EXPIRING_SOON_DAYS } from '@/lib/constants'

/* ── Primitives ─────────────────────────────────────────────────────────── */

export function today(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function parseRenewalDate(isoDate: string): Date {
  return parseISO(isoDate)
}

/* ── Days remaining (negative = overdue) ───────────────────────────────── */
export function getDaysRemaining(renewalDate: string): number {
  return differenceInCalendarDays(parseISO(renewalDate), today())
}

/* ── Boolean helpers ────────────────────────────────────────────────────── */
export function isOverdue(renewalDate: string): boolean {
  return getDaysRemaining(renewalDate) < 0
}

export function isExpiringSoon(renewalDate: string, thresholdDays = EXPIRING_SOON_DAYS): boolean {
  const days = getDaysRemaining(renewalDate)
  return days >= 0 && days <= thresholdDays
}

export function isDueThisMonth(renewalDate: string): boolean {
  const d = parseISO(renewalDate)
  const now = today()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

/* ── Urgency derivation ─────────────────────────────────────────────────── */
export function computeUrgency(renewal: Pick<Renewal, 'renewal_date' | 'status'>): RenewalUrgency {
  if (renewal.status === 'archived')  return 'archived'
  if (renewal.status === 'completed') return 'completed'
  if (isOverdue(renewal.renewal_date))       return 'overdue'
  if (isExpiringSoon(renewal.renewal_date))  return 'expiring_soon'
  return 'active'
}

/* ── Date formatting (respects user DateFormat preference) ──────────────── */
const FORMAT_MAP: Record<DateFormat, string> = {
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd',
}

export function formatDate(isoDate: string, dateFormat: DateFormat = 'DD/MM/YYYY'): string {
  return format(parseISO(isoDate), FORMAT_MAP[dateFormat])
}

export function formatDateRelative(isoDate: string): string {
  const days = getDaysRemaining(isoDate)
  if (days === 0)  return 'Today'
  if (days === 1)  return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days < 0)   return `${Math.abs(days)} days ago`
  return `in ${days} days`
}

/* ── Next renewal date calculation ──────────────────────────────────────── */
export function getNextRenewalDate(currentDate: string, frequency: RenewalFrequency): string {
  const base = parseISO(currentDate)
  switch (frequency) {
    case 'monthly':   return toISODateString(addMonths(base, 1))
    case 'quarterly': return toISODateString(addMonths(base, 3))
    case 'bi_annual': return toISODateString(addMonths(base, 6))
    case 'annual':    return toISODateString(addYears(base, 1))
    case 'one_time':  return currentDate
  }
}

/* ── Reminder scheduled date (renewal_date minus N days) ───────────────── */
export function getReminderDate(renewalDate: string, daysBefore: number): string {
  return toISODateString(addDays(parseISO(renewalDate), -daysBefore))
}

/* ── Month range helpers (for dashboard queries) ────────────────────────── */
export function currentMonthRange(): { start: string; end: string } {
  const now = today()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { start: toISODateString(start), end: toISODateString(end) }
}
