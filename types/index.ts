/* ─────────────────────────────────────────────────────────────────────────
   RenewalGuard — Core TypeScript Types
   ───────────────────────────────────────────────────────────────────────── */

/* ── Enums ─────────────────────────────────────────────────────────────── */

export type RenewalCategory =
  | 'subscription'
  | 'domain'
  | 'insurance'
  | 'passport'
  | 'visa'
  | 'certification'
  | 'membership'
  | 'business_permit'
  | 'tax'
  | 'other'

export type RenewalFrequency =
  | 'one_time'
  | 'monthly'
  | 'quarterly'
  | 'bi_annual'
  | 'annual'

export type RenewalStatus = 'active' | 'archived' | 'completed'

export type ReminderStatus = 'pending' | 'sent' | 'failed' | 'cancelled'

export type NotificationType = 'reminder_sent' | 'renewal_due' | 'renewal_overdue'

export type ActivityEventType =
  | 'created'
  | 'edited'
  | 'archived'
  | 'restored'
  | 'reminder_scheduled'
  | 'reminder_sent'
  | 'completed'
  | 'deleted'

export type Theme = 'light' | 'dark' | 'system'

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'

/* ── Computed status (derived from date, not stored) ────────────────────── */
export type RenewalUrgency = 'active' | 'expiring_soon' | 'overdue' | 'archived' | 'completed'

/* ── Database Row Types ─────────────────────────────────────────────────── */

export interface Profile {
  id: string
  full_name: string
  country: string | null
  timezone: string
  currency: string
  date_format: DateFormat
  theme: Theme
  default_reminder_days: number[]
  created_at: string
  updated_at: string
}

export interface Renewal {
  id: string
  user_id: string
  title: string
  category: RenewalCategory
  frequency: RenewalFrequency
  amount: number | null
  currency: string | null
  renewal_date: string
  notes: string | null
  status: RenewalStatus
  reminder_days: number[]
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  renewal_id: string
  days_before: number
  scheduled_date: string
  status: ReminderStatus
  sent_at: string | null
  error_msg: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  renewal_id: string | null
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface RenewalActivityLog {
  id: string
  renewal_id: string
  user_id: string
  event_type: ActivityEventType
  metadata: Record<string, unknown> | null
  created_at: string
}

/* ── Enriched / View Types ──────────────────────────────────────────────── */

export interface RenewalWithUrgency extends Renewal {
  urgency: RenewalUrgency
  days_remaining: number
}

export interface DashboardStats {
  total_active: number
  due_this_month: number
  overdue: number
  estimated_spend: number
  currency: string
}

/* ── Form Types ─────────────────────────────────────────────────────────── */

export interface CreateRenewalInput {
  title: string
  category: RenewalCategory
  frequency: RenewalFrequency
  renewal_date: string
  reminder_days: number[]
  amount?: number | null
  notes?: string | null
}

export interface UpdateRenewalInput extends Partial<CreateRenewalInput> {
  status?: RenewalStatus
}

export interface UpdateProfileInput {
  full_name: string
  timezone: string
}

export interface UpdatePreferencesInput {
  currency: string
  date_format: DateFormat
  theme: Theme
  default_reminder_days: number[]
}

/* ── Server Action Result Types ─────────────────────────────────────────── */

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Partial<Record<string, string[]>>
}

/* ── Filter / Sort Types (Renewal List) ─────────────────────────────────── */

export type RenewalFilter = 'all' | 'active' | 'archived' | 'due_this_month' | 'overdue'

export type RenewalSortKey = 'newest' | 'oldest' | 'due_date' | 'category' | 'cost'

export interface RenewalListParams {
  filter: RenewalFilter
  sort: RenewalSortKey
  search: string
}

/* ── Navigation Types ───────────────────────────────────────────────────── */

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

/* ── Category display metadata ──────────────────────────────────────────── */

export interface CategoryMeta {
  label: string
  icon: string
  color: string
  bgColor: string
  darkColor: string
  darkBgColor: string
}
