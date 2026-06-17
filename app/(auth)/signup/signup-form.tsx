'use client'

import { useActionState } from 'react'
import { signUpAction } from '@/lib/actions/auth'
import type { ActionResult } from '@/types'

const initialState: ActionResult = { success: false }

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState)

  if (state.success) {
    return (
      <p className="text-center text-sm text-foreground">
        Check your inbox — we&apos;ve sent a confirmation link to finish setting up your account.
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">{state.error}</p>
      )}

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-foreground">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        {state.fieldErrors?.fullName && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.fullName[0]}</p>
        )}
      </div>

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

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
