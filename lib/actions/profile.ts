'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_REMINDER_DAYS } from '@/lib/constants'
import type { ActionResult, DateFormat, Theme } from '@/types'

/* ── Profile ────────────────────────────────────────────────────────────── */

export async function updateProfileAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const full_name = String(formData.get('full_name') ?? '').trim()
  const timezone = String(formData.get('timezone') ?? '').trim()

  const fieldErrors: Partial<Record<string, string[]>> = {}
  if (!full_name) fieldErrors.full_name = ['Full name is required.']
  if (!timezone) fieldErrors.timezone = ['Timezone is required.']

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'You must be signed in.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, timezone })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/settings')
  revalidatePath('/dashboard', 'layout')
  return { success: true }
}

/* ── Preferences ────────────────────────────────────────────────────────── */

const VALID_DATE_FORMATS: DateFormat[] = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const VALID_THEMES: Theme[] = ['light', 'dark', 'system']

export async function updatePreferencesAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const currency = String(formData.get('currency') ?? '').trim()
  const date_format = String(formData.get('date_format') ?? '')
  const theme = String(formData.get('theme') ?? '')
  const default_reminder_days = formData
    .getAll('default_reminder_days')
    .map(Number)
    .filter(n => Number.isFinite(n) && n >= 0)

  const fieldErrors: Partial<Record<string, string[]>> = {}
  if (!currency) fieldErrors.currency = ['Currency is required.']
  if (!VALID_DATE_FORMATS.includes(date_format as DateFormat)) fieldErrors.date_format = ['Invalid date format.']
  if (!VALID_THEMES.includes(theme as Theme)) fieldErrors.theme = ['Invalid theme.']

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'You must be signed in.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      currency,
      date_format:            date_format as DateFormat,
      theme:                  theme as Theme,
      default_reminder_days:  default_reminder_days.length > 0 ? default_reminder_days : DEFAULT_REMINDER_DAYS,
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/settings')
  revalidatePath('/dashboard', 'layout')
  return { success: true }
}
