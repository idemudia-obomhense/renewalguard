import type { RenewalCategory, RenewalFrequency, RenewalStatus, RenewalUrgency } from '@/types'
import { CATEGORY_META, FREQUENCY_LABELS, STATUS_LABELS, SUPPORTED_CURRENCIES } from '@/lib/constants'

/* ── Currency ───────────────────────────────────────────────────────────── */

export function getCurrencySymbol(currencyCode: string): string {
  return SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)?.symbol ?? currencyCode
}

export function formatCurrency(amount: number, currencyCode: string): string {
  // Built from our own SUPPORTED_CURRENCIES symbol table rather than Intl's
  // `style: 'currency'` — Intl falls back to printing the ISO code itself as
  // the "symbol" for currencies its locale data doesn't recognize (e.g. NGN),
  // which previously caused formatAmount to show the code twice ("NGN 100 NGN").
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${getCurrencySymbol(currencyCode)}${formattedNumber}`
}

export function formatAmount(amount: number | null, currencyCode: string | null): string {
  if (amount == null || currencyCode == null) return '—'
  return formatCurrency(amount, currencyCode)
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

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || 'there'
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
  // "before" is folded into each label individually rather than appended
  // once to the joined string, since "the same day" (0) can't take a
  // "before" suffix the way "N days" can.
  const labels = days
    .slice()
    .sort((a, b) => a - b)
    .map(d => {
      if (d === 0) return 'the same day'
      return d === 1 ? '1 day before' : `${d} days before`
    })
  return labels.join(', ')
}
