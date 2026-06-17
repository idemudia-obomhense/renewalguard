'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { CATEGORY_META, DEFAULT_REMINDER_DAYS, FREQUENCY_LABELS, REMINDER_DAY_OPTIONS } from '@/lib/constants'
import type { ActionResult, Renewal } from '@/types'

interface RenewalFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
  renewal?: Renewal
  defaultReminderDays?: number[]
  submitLabel: string
}

const initialState: ActionResult = { success: false }

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring'

export function RenewalForm({ action, renewal, defaultReminderDays, submitLabel }: RenewalFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const selectedReminderDays = new Set(
    renewal?.reminder_days ?? defaultReminderDays ?? DEFAULT_REMINDER_DAYS,
  )

  return (
    <form action={formAction} className="space-y-5">
      {renewal && (
        <>
          <input type="hidden" name="id" value={renewal.id} />
          <input type="hidden" name="status" value={renewal.status} />
        </>
      )}

      {state.error && (
        <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600 dark:bg-danger-600/15">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={renewal?.title}
          required
          className={inputClass}
        />
        {state.fieldErrors?.title && (
          <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={renewal?.category ?? ''}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Select a category
            </option>
            {Object.entries(CATEGORY_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.category && (
            <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.category[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="frequency" className="mb-1.5 block text-sm font-medium text-foreground">
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            defaultValue={renewal?.frequency ?? ''}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Select frequency
            </option>
            {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.frequency && (
            <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.frequency[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="renewal_date" className="mb-1.5 block text-sm font-medium text-foreground">
            Renewal date
          </label>
          <input
            id="renewal_date"
            name="renewal_date"
            type="date"
            defaultValue={renewal?.renewal_date}
            required
            className={inputClass}
          />
          {state.fieldErrors?.renewal_date && (
            <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.renewal_date[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-foreground">
            Amount (optional)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={renewal?.amount ?? ''}
            className={inputClass}
          />
          {state.fieldErrors?.amount && (
            <p className="mt-1 text-xs text-danger-600">{state.fieldErrors.amount[0]}</p>
          )}
        </div>
      </div>

      <div>
        <p className="mb-1.5 block text-sm font-medium text-foreground">Remind me before</p>
        <div className="flex flex-wrap gap-2">
          {REMINDER_DAY_OPTIONS.map(days => (
            <label
              key={days}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-input px-3 py-1.5 text-sm text-foreground has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input
                type="checkbox"
                name="reminder_days"
                value={days}
                defaultChecked={selectedReminderDays.has(days)}
                className="h-3.5 w-3.5 accent-primary"
              />
              {days === 1 ? '1 day' : `${days} days`}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-foreground">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={renewal?.notes ?? ''}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'Saving…' : submitLabel}
        </button>
        <Link
          href={renewal ? `/renewals/${renewal.id}` : '/renewals'}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
