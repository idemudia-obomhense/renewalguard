'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types'

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

/* ── Sign in ────────────────────────────────────────────────────────────── */

export async function signInAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: 'Incorrect email or password.' }
  }

  redirect('/dashboard')
}

/* ── Sign up ────────────────────────────────────────────────────────────── */

export async function signUpAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  const fieldErrors: Partial<Record<string, string[]>> = {}
  if (!fullName) fieldErrors.fullName = ['Full name is required.']
  if (!email) fieldErrors.email = ['Email is required.']
  if (password.length < 8) fieldErrors.password = ['Password must be at least 8 characters.']
  if (password !== confirmPassword) fieldErrors.confirmPassword = ['Passwords do not match.']

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=/dashboard`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Email confirmation is disabled in Supabase, so signUp already returns a
  // live session — go straight to the dashboard instead of asking the user
  // to check their inbox. Falls back to the inbox message if confirmation
  // ever gets turned back on (signUp then returns no session).
  if (data.session) {
    redirect('/dashboard')
  }

  return { success: true }
}

/* ── Forgot password (request reset email) ─────────────────────────────── */

export async function requestPasswordResetAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    return { success: false, error: 'Email is required.', fieldErrors: { email: ['Email is required.'] } }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/confirm?next=/reset-password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Always report success regardless of whether the email exists, to avoid leaking account existence.
  return { success: true }
}

/* ── Reset password (set new password after recovery link) ─────────────── */

export async function updatePasswordAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  const fieldErrors: Partial<Record<string, string[]>> = {}
  if (password.length < 8) fieldErrors.password = ['Password must be at least 8 characters.']
  if (password !== confirmPassword) fieldErrors.confirmPassword = ['Passwords do not match.']

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { success: false, error: error.message }
  }

  redirect('/login?reset=success')
}

/* ── Sign out ───────────────────────────────────────────────────────────── */

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
