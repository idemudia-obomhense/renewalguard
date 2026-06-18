import type { RenewalCategory, RenewalFrequency, RenewalStatus, RenewalUrgency } from '@/types'
import { CATEGORY_META, FREQUENCY_LABELS, STATUS_LABELS, SUPPORTED_CURRENCIES } from '@/lib/constants'

/* ── Currency ───────────────────────────────────────────────────────────── */

export function getCurrencySymbol(currencyCode: string): string {
  return SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)?.symbol ?? currencyCode
}

export function formatCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style:                 'currency',
      currency:              currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${getCurrencySymbol(currencyCode)}${amount.toFixed(2)}`
  }
}

export function formatAmount(amount: number | null, currencyCode: string | null): string {
  if (amount == null || currencyCode == null) return '—'
  // Symbols alone are ambiguous (USD/CAD/AUD all use "$"), so the code is always shown alongside.
  return `${formatCurrency(amount, currencyCode)} ${currencyCode}`
}

/* ── Category / Frequency / Status labels ───────────────────────────────── */

export function formatCategoryLabel(category: RenewalCategory): string {
  return CATEGORY_META[category]?.label ?? category
}

export function formatFrequencyLabel(frequency: RenewalFrequency): string {
  return FREQUENCY_LABELS[frequency] ?? frequency
}

export function formatStatusLabel(status: RenewalStatus): string {
  return STATUS_LABELS[status] ?? status
}

/* ── Urgency display ────────────────────────────────────────────────────── */

export interface UrgencyDisplay {
  label:      string
  color:      string
  bgColor:    string
  darkColor:  string
  darkBgColor:string
}

export const URGENCY_DISPLAY: Record<RenewalUrgency, UrgencyDisplay> = {
  active: {
    label:       'Active',
    color:       'text-emerald-700',
    bgColor:     'bg-emerald-50',
    darkColor:   'dark:text-emerald-400',
    darkBgColor: 'dark:bg-emerald-950/40',
  },
  expiring_soon: {
    label:       'Expiring Soon',
    color:       'text-amber-700',
    bgColor:     'bg-amber-50',
    darkColor:   'dark:text-amber-400',
    darkBgColor: 'dark:bg-amber-950/40',
  },
  overdue: {
    label:       'Overdue',
    color:       'text-red-700',
    bgColor:     'bg-red-50',
    darkColor:   'dark:text-red-400',
    darkBgColor: 'dark:bg-red-950/40',
  },
  archived: {
    label:       'Archived',
    color:       'text-stone-500',
    bgColor:     'bg-stone-50',
    darkColor:   'dark:text-stone-400',
    darkBgColor: 'dark:bg-stone-900/40',
  },
  completed: {
    label:       'Completed',
    color:       'text-blue-700',
    bgColor:     'bg-blue-50',
    darkColor:   'dark:text-blue-400',
    darkBgColor: 'dark:bg-blue-950/40',
  },
}

/* ── String helpers ─────────────────────────────────────────────────────── */

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 1)}…`
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

/* ── Reminder day label ─────────────────────────────────────────────────── */

export function formatReminderDays(days: number[]): string {
  if (days.length === 0) return 'No reminders'
  const labels = days
    .slice()
    .sort((a, b) => a - b)
    .map(d => (d === 1 ? '1 day' : `${d} days`))
  return labels.join(', ') + ' before'
}
