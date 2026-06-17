'use client'

import { useActionState } from 'react'
import { updateProfileAction } from '@/lib/actions/profile'
import type { ActionResult, Profile } from '@/types'

interface ProfileFormProps {
  profile: Profile
}

const initialState: ActionResult = { success: false }

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring'

const TIMEZONES = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : ['UTC']

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {state.success && (
        <p className="rounded-lg bg-success-50 px-3 py-2 text-sm text-success-700 dark:bg-success-600/15">
          Profile updated.
        </p>
      )}
      {state.error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600 dark:bg-danger-600/15">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-foreground">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={profile.full_name}
          required
          className={inputClass}
        />
        {state.fieldErrors?.full_name && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.full_name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="timezone" className="mb-1.5 block text-sm font-medium text-foreground">
          Timezone
        </label>
        <select id="timezone" name="timezone" defaultValue={profile.timezone} required className={inputClass}>
          {TIMEZONES.map(tz => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        {state.fieldErrors?.timezone && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.timezone[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
