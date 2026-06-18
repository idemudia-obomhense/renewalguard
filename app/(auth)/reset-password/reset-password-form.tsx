'use client'

import { useActionState } from 'react'
import { updatePasswordAction } from '@/lib/actions/auth'
import { PasswordInput } from '@/components/auth/password-input'
import type { ActionResult } from '@/types'

const initialState: ActionResult = { success: false }

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">{state.error}</p>
      )}

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
          New password
        </label>
        <PasswordInput id="password" name="password" autoComplete="new-password" required />
        {state.fieldErrors?.password && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
          Confirm new password
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
        {pending ? 'Updating…' : 'Update password'}
      </button>
    </form>
  )
}
