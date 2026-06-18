'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_CURRENCY, DEFAULT_REMINDER_DAYS, SUPPORTED_CURRENCIES } from '@/lib/constants'
import { getReminderDate } from '@/lib/utils/date'
import type { ActionResult, RenewalCategory, RenewalFrequency, RenewalStatus } from '@/types'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * Reminders are rows in their own table (picked up by the email cron job),
 * not derived from renewals.reminder_days at send time. Re-sync them
 * whenever a renewal's date/reminder_days change, or whenever it stops
 * being active, so the cron never emails about a stale or inactive renewal.
 */
async function syncPendingReminders(
  supabase: SupabaseServerClient,
  renewalId: string,
  renewalDate: string,
  reminderDays: number[],
): Promise<void> {
  await supabase.from('reminders').delete().eq('renewal_id', renewalId).eq('status', 'pending')

  if (reminderDays.length === 0) return

  const rows = reminderDays.map(days => ({
    renewal_id:     renewalId,
    days_before:    days,
    scheduled_date: getReminderDate(renewalDate, days),
  }))

  await supabase.from('reminders').insert(rows)
}

async function cancelPendingReminders(supabase: SupabaseServerClient, renewalId: string): Promise<void> {
  await supabase
    .from('reminders')
    .update({ status: 'cancelled' })
    .eq('renewal_id', renewalId)
    .eq('status', 'pending')
}

const VALID_CATEGORIES: RenewalCategory[] = [
  'subscription', 'domain', 'insurance', 'passport', 'visa',
  'certification', 'membership', 'business_permit', 'tax', 'other',
]
const VALID_FREQUENCIES: RenewalFrequency[] = ['one_time', 'monthly', 'quarterly', 'bi_annual', 'annual']
const VALID_CURRENCY_CODES = SUPPORTED_CURRENCIES.map(c => c.code)

function parseReminderDays(formData: FormData): number[] {
  return formData.getAll('reminder_days').map(Number).filter(n => Number.isFinite(n) && n > 0)
}

function validateRenewalInput(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const category = String(formData.get('category') ?? '')
  const frequency = String(formData.get('frequency') ?? '')
  const renewal_date = String(formData.get('renewal_date') ?? '')
  const amountRaw = String(formData.get('amount') ?? '').trim()
  const currencyRaw = String(formData.get('currency') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim()
  const reminder_days = parseReminderDays(formData)

  const fieldErrors: Partial<Record<string, string[]>> = {}

  if (!title) fieldErrors.title = ['Title is required.']
  else if (title.length > 200) fieldErrors.title = ['Title must be 200 characters or fewer.']

  if (!VALID_CATEGORIES.includes(category as RenewalCategory)) {
    fieldErrors.category = ['Please select a category.']
  }
  if (!VALID_FREQUENCIES.includes(frequency as RenewalFrequency)) {
    fieldErrors.frequency = ['Please select a frequency.']
  }
  if (!renewal_date) fieldErrors.renewal_date = ['Renewal date is required.']

  let amount: number | null = null
  let currency: string | null = null
  if (amountRaw) {
    amount = Number(amountRaw)
    if (Number.isNaN(amount) || amount < 0) {
      fieldErrors.amount = ['Amount must be a positive number.']
    } else {
      currency = VALID_CURRENCY_CODES.includes(currencyRaw) ? currencyRaw : DEFAULT_CURRENCY
    }
  }

  return {
    fieldErrors,
    values: {
      title,
      category:      category as RenewalCategory,
      frequency:     frequency as RenewalFrequency,
      renewal_date,
      amount,
      currency,
      notes:         notes || null,
      reminder_days: reminder_days.length > 0 ? reminder_days : DEFAULT_REMINDER_DAYS,
    },
  }
}

/* ── Create ─────────────────────────────────────────────────────────────── */

export async function createRenewalAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { fieldErrors, values } = validateRenewalInput(formData)

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'You must be signed in.' }

  const { data: inserted, error } = await supabase
    .from('renewals')
    .insert({
      user_id:       user.id,
      title:         values.title,
      category:      values.category,
      frequency:     values.frequency,
      renewal_date:  values.renewal_date,
      amount:        values.amount,
      currency:      values.currency,
      notes:         values.notes,
      reminder_days: values.reminder_days,
    })
    .select('id')
    .single()

  if (error || !inserted) {
    return { success: false, error: error?.message ?? 'Could not create renewal.' }
  }

  await syncPendingReminders(supabase, inserted.id, values.renewal_date, values.reminder_days)

  revalidatePath('/dashboard')
  revalidatePath('/renewals')
  redirect(`/renewals/${inserted.id}`)
}

/* ── Update ─────────────────────────────────────────────────────────────── */

export async function updateRenewalAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get('id') ?? '')
  if (!id) return { success: false, error: 'Missing renewal id.' }

  const status = String(formData.get('status') ?? 'active') as RenewalStatus

  const { fieldErrors, values } = validateRenewalInput(formData)

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('renewals')
    .update({
      title:         values.title,
      category:      values.category,
      frequency:     values.frequency,
      renewal_date:  values.renewal_date,
      amount:        values.amount,
      currency:      values.currency,
      notes:         values.notes,
      reminder_days: values.reminder_days,
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  if (status === 'active') {
    await syncPendingReminders(supabase, id, values.renewal_date, values.reminder_days)
  } else {
    await cancelPendingReminders(supabase, id)
  }

  revalidatePath('/dashboard')
  revalidatePath('/renewals')
  revalidatePath(`/renewals/${id}`)
  redirect(`/renewals/${id}`)
}

/* ── Status transitions ────────────────────────────────────────────────── */

export async function archiveRenewalAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('renewals').update({ status: 'archived' }).eq('id', id)
  await cancelPendingReminders(supabase, id)

  revalidatePath('/dashboard')
  revalidatePath('/renewals')
  revalidatePath(`/renewals/${id}`)
}

export async function restoreRenewalAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('renewals').update({ status: 'active' }).eq('id', id)

  const { data: renewal } = await supabase
    .from('renewals')
    .select('renewal_date, reminder_days')
    .eq('id', id)
    .single()

  if (renewal) {
    await syncPendingReminders(supabase, id, renewal.renewal_date, renewal.reminder_days)
  }

  revalidatePath('/dashboard')
  revalidatePath('/renewals')
  revalidatePath(`/renewals/${id}`)
}

export async function completeRenewalAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('renewals').update({ status: 'completed' }).eq('id', id)
  await cancelPendingReminders(supabase, id)

  revalidatePath('/dashboard')
  revalidatePath('/renewals')
  revalidatePath(`/renewals/${id}`)
}

/* ── Delete (soft) ──────────────────────────────────────────────────────── */

export async function deleteRenewalAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('renewals').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  await cancelPendingReminders(supabase, id)

  revalidatePath('/dashboard')
  revalidatePath('/renewals')
  redirect('/renewals')
}
