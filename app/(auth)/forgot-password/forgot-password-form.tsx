'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '@/lib/actions/auth'
import type { ActionResult } from '@/types'

const initialState: ActionResult = { success: false }

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState)

  if (state.success) {
    return (
      <p className="text-center text-sm text-foreground">
        If an account exists for that email, we&apos;ve sent a link to reset your password.
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">{state.error}</p>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  )
}
