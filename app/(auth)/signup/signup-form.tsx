'use client'

import { useActionState } from 'react'
import { signUpAction } from '@/lib/actions/auth'
import { COUNTRY_CURRENCY_MAP } from '@/lib/constants'
import { PasswordInput } from '@/components/auth/password-input'
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
        <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-foreground">
          Country
        </label>
        <select
          id="country"
          name="country"
          defaultValue=""
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>
            Select your country
          </option>
          {COUNTRY_CURRENCY_MAP.map(c => (
            <option key={c.country} value={c.country}>
              {c.country}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">Sets your default currency for renewals.</p>
        {state.fieldErrors?.country && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.country[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          Password
        </label>
        <PasswordInput id="password" name="password" autoComplete="new-password" required />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
          Confirm password
        </label>
        <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
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
