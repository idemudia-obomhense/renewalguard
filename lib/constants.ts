import type {
  RenewalCategory,
  RenewalFrequency,
  RenewalIntent,
  RenewalStatus,
  DateFormat,
  CategoryMeta,
  RenewalFilter,
  RenewalSortKey,
} from '@/types'

/* ── Urgency threshold ──────────────────────────────────────────────────── */
export const EXPIRING_SOON_DAYS = 30

/* ── Reminder day presets ───────────────────────────────────────────────── */
export const REMINDER_DAY_OPTIONS: number[] = [0, 1, 3, 7, 14, 30, 60, 90]

export const DEFAULT_REMINDER_DAYS: number[] = [7, 30]

/* ── One-time renewal intent (only relevant when frequency = 'one_time') ── */
export const RENEWAL_INTENT_OPTIONS: { value: RenewalIntent; label: string }[] = [
  { value: 'renew',  label: '🔄 Remind me to renew' },
  { value: 'cancel', label: '❌ Remind me to cancel / deactivate' },
]

/* ── Locale / display defaults ──────────────────────────────────────────── */
export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_TIMEZONE = 'UTC'
export const DEFAULT_DATE_FORMAT: DateFormat = 'DD/MM/YYYY'

/* ── Supported currencies ───────────────────────────────────────────────── */
export const SUPPORTED_CURRENCIES: { code: string; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar',          symbol: '$'  },
  { code: 'EUR', label: 'Euro',               symbol: '€'  },
  { code: 'GBP', label: 'British Pound',      symbol: '£'  },
  { code: 'NGN', label: 'Nigerian Naira',     symbol: '₦'  },
  { code: 'CAD', label: 'Canadian Dollar',    symbol: 'CA$'},
  { code: 'AUD', label: 'Australian Dollar',  symbol: 'A$' },
  { code: 'JPY', label: 'Japanese Yen',       symbol: '¥'  },
  { code: 'INR', label: 'Indian Rupee',       symbol: '₹'  },
  { code: 'ZAR', label: 'South African Rand', symbol: 'R'  },
  { code: 'GHS', label: 'Ghanaian Cedi',      symbol: 'GH₵'},
  { code: 'KES', label: 'Kenyan Shilling',    symbol: 'KSh'},
]

/* ── Countries → default currency ───────────────────────────────────────── */
export const COUNTRY_CURRENCY_MAP: { country: string; currency: string }[] = [
  { country: 'Nigeria',        currency: 'NGN' },
  { country: 'United States',  currency: 'USD' },
  { country: 'United Kingdom', currency: 'GBP' },
  { country: 'Ghana',          currency: 'GHS' },
  { country: 'Kenya',          currency: 'KES' },
  { country: 'South Africa',   currency: 'ZAR' },
  { country: 'Japan',          currency: 'JPY' },
  { country: 'Canada',         currency: 'CAD' },
  { country: 'Australia',      currency: 'AUD' },
  // Europe → EUR
  { country: 'Austria',     currency: 'EUR' },
  { country: 'Belgium',     currency: 'EUR' },
  { country: 'Denmark',     currency: 'EUR' },
  { country: 'Finland',     currency: 'EUR' },
  { country: 'France',      currency: 'EUR' },
  { country: 'Germany',     currency: 'EUR' },
  { country: 'Greece',      currency: 'EUR' },
  { country: 'Ireland',     currency: 'EUR' },
  { country: 'Italy',       currency: 'EUR' },
  { country: 'Netherlands', currency: 'EUR' },
  { country: 'Norway',      currency: 'EUR' },
  { country: 'Poland',      currency: 'EUR' },
  { country: 'Portugal',    currency: 'EUR' },
  { country: 'Spain',       currency: 'EUR' },
  { country: 'Sweden',      currency: 'EUR' },
  { country: 'Switzerland', currency: 'EUR' },
  // Fallback for anything not explicitly mapped above
  { country: 'Other', currency: DEFAULT_CURRENCY },
]

export function getCurrencyForCountry(country: string): string {
  return COUNTRY_CURRENCY_MAP.find(c => c.country === country)?.currency ?? DEFAULT_CURRENCY
}

/* ── Category metadata ──────────────────────────────────────────────────── */
export const CATEGORY_META: Record<RenewalCategory, CategoryMeta> = {
  subscription: {
    label:      'Subscription',
    icon:       'CreditCard',
    color:      'text-blue-600',
    bgColor:    'bg-blue-50',
    darkColor:  'dark:text-blue-400',
    darkBgColor:'dark:bg-blue-950/40',
  },
  domain: {
    label:      'Domain',
    icon:       'Globe',
    color:      'text-violet-600',
    bgColor:    'bg-violet-50',
    darkColor:  'dark:text-violet-400',
    darkBgColor:'dark:bg-violet-950/40',
  },
  insurance: {
    label:      'Insurance',
    icon:       'Shield',
    color:      'text-emerald-600',
    bgColor:    'bg-emerald-50',
    darkColor:  'dark:text-emerald-400',
    darkBgColor:'dark:bg-emerald-950/40',
  },
  passport: {
    label:      'Passport',
    icon:       'BookOpen',
    color:      'text-indigo-600',
    bgColor:    'bg-indigo-50',
    darkColor:  'dark:text-indigo-400',
    darkBgColor:'dark:bg-indigo-950/40',
  },
  visa: {
    label:      'Visa',
    icon:       'Stamp',
    color:      'text-cyan-600',
    bgColor:    'bg-cyan-50',
    darkColor:  'dark:text-cyan-400',
    darkBgColor:'dark:bg-cyan-950/40',
  },
  certification: {
    label:      'Certification',
    icon:       'Award',
    color:      'text-amber-600',
    bgColor:    'bg-amber-50',
    darkColor:  'dark:text-amber-400',
    darkBgColor:'dark:bg-amber-950/40',
  },
  membership: {
    label:      'Membership',
    icon:       'Users',
    color:      'text-pink-600',
    bgColor:    'bg-pink-50',
    darkColor:  'dark:text-pink-400',
    darkBgColor:'dark:bg-pink-950/40',
  },
  business_permit: {
    label:      'Business Permit',
    icon:       'Building2',
    color:      'text-orange-600',
    bgColor:    'bg-orange-50',
    darkColor:  'dark:text-orange-400',
    darkBgColor:'dark:bg-orange-950/40',
  },
  tax: {
    label:      'Tax',
    icon:       'Receipt',
    color:      'text-red-600',
    bgColor:    'bg-red-50',
    darkColor:  'dark:text-red-400',
    darkBgColor:'dark:bg-red-950/40',
  },
  other: {
    label:      'Other',
    icon:       'Tag',
    color:      'text-stone-600',
    bgColor:    'bg-stone-50',
    darkColor:  'dark:text-stone-400',
    darkBgColor:'dark:bg-stone-950/40',
  },
}

/* ── Category colors as hex (for charts — same shade each category already
   uses via CATEGORY_META's `color` class, just resolved to a value usable
   in inline styles like a conic-gradient) ─────────────────────────────── */
export const CATEGORY_COLOR_HEX: Record<RenewalCategory, string> = {
  subscription:    '#2563eb', // blue-600
  domain:          '#7c3aed', // violet-600
  insurance:       '#059669', // emerald-600
  passport:        '#4f46e5', // indigo-600
  visa:            '#0891b2', // cyan-600
  certification:   '#d97706', // amber-600
  membership:      '#db2777', // pink-600
  business_permit: '#ea580c', // orange-600
  tax:             '#dc2626', // red-600
  other:           '#57534e', // stone-600
}

/* ── Frequency labels ───────────────────────────────────────────────────── */
export const FREQUENCY_LABELS: Record<RenewalFrequency, string> = {
  one_time:   'One-time',
  monthly:    'Monthly',
  quarterly:  'Quarterly',
  bi_annual:  'Bi-annual',
  annual:     'Annual',
}

/* ── Status labels ──────────────────────────────────────────────────────── */
export const STATUS_LABELS: Record<RenewalStatus, string> = {
  active:    'Active',
  archived:  'Archived',
  completed: 'Completed',
}

/* ── Renewal list filter labels ─────────────────────────────────────────── */
export const FILTER_LABELS: Record<RenewalFilter, string> = {
  all:           'All',
  active:        'Active',
  archived:      'Archived',
  due_this_month:'Due This Month',
  overdue:       'Overdue',
}

/* ── Renewal sort options ───────────────────────────────────────────────── */
export const SORT_OPTIONS: { value: RenewalSortKey; label: string }[] = [
  { value: 'due_date',  label: 'Due Date'   },
  { value: 'newest',    label: 'Newest'     },
  { value: 'oldest',    label: 'Oldest'     },
  { value: 'category',  label: 'Category'   },
  { value: 'cost',      label: 'Cost'       },
]

/* ── App-level constants ────────────────────────────────────────────────── */
export const APP_NAME = 'RenewalGuard'
export const APP_DESCRIPTION = 'Never miss a renewal deadline again.'

export const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/dashboard',  icon: 'LayoutDashboard' },
  { label: 'Renewals',   href: '/renewals',   icon: 'CalendarClock'   },
  { label: 'Analytics',  href: '/analytics',  icon: 'BarChart3'       },
  { label: 'Settings',   href: '/settings',   icon: 'Settings'        },
] as const
