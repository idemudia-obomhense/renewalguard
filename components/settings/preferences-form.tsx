'use client'

import { useActionState } from 'react'
import { updatePreferencesAction } from '@/lib/actions/profile'
import { REMINDER_DAY_OPTIONS, SUPPORTED_CURRENCIES } from '@/lib/constants'
import type { ActionResult, Profile } from '@/types'

interface PreferencesFormProps {
  profile: Profile
}

const initialState: ActionResult = { success: false }

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring'

const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] as const
const THEMES = ['light', 'dark', 'system'] as const

export function PreferencesForm({ profile }: PreferencesFormProps) {
  const [state, formAction, pending] = useActionState(updatePreferencesAction, initialState)
  const selectedReminderDays = new Set(profile.default_reminder_days)

  return (
    <form action={formAction} className="space-y-5">
      {state.success && (
        <p className="rounded-lg bg-success-50 px-3 py-2 text-sm text-success-700 dark:bg-success-600/15">
          Preferences updated.
        </p>
      )}
      {state.error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600 dark:bg-danger-600/15">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="currency" className="mb-1.5 block text-sm font-medium text-foreground">
            Currency
          </label>
          <select id="currency" name="currency" defaultValue={profile.currency} required className={inputClass}>
            {SUPPORTED_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date_format" className="mb-1.5 block text-sm font-medium text-foreground">
            Date format
          </label>
          <select
            id="date_format"
            name="date_format"
            defaultValue={profile.date_format}
            required
            className={inputClass}
          >
            {DATE_FORMATS.map(f => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="theme" className="mb-1.5 block text-sm font-medium text-foreground">
          Theme
        </label>
        <select id="theme" name="theme" defaultValue={profile.theme} required className={inputClass}>
          {THEMES.map(t => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-foreground">Default reminder days</p>
        <p className="mb-2 text-xs text-muted-foreground">Applied automatically to new renewals.</p>
        <div className="flex flex-wrap gap-2">
          {REMINDER_DAY_OPTIONS.map(days => (
            <label
              key={days}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-input px-3 py-1.5 text-sm text-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input
                type="checkbox"
                name="default_reminder_days"
                value={days}
                defaultChecked={selectedReminderDays.has(days)}
                className="h-3.5 w-3.5 accent-primary"
              />
              {days === 1 ? '1 day' : `${days} days`}
            </label>
          ))}
        </div>
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
