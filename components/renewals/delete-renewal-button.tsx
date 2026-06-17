'use client'

import { Trash2 } from 'lucide-react'
import { deleteRenewalAction } from '@/lib/actions/renewals'

interface DeleteRenewalButtonProps {
  id: string
}

export function DeleteRenewalButton({ id }: DeleteRenewalButtonProps) {
  return (
    <form
      action={deleteRenewalAction}
      onSubmit={e => {
        if (!window.confirm('Delete this renewal? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg border border-danger-200 px-4 py-2 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50 dark:border-danger-600/30 dark:hover:bg-danger-600/15"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </form>
  )
}
