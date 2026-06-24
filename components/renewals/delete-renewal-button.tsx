'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteRenewalAction } from '@/lib/actions/renewals'

interface DeleteRenewalButtonProps {
  id: string
}

export function DeleteRenewalButton({ id }: DeleteRenewalButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!window.confirm('Delete this renewal? This cannot be undone.')) return

    const formData = new FormData()
    formData.set('id', id)

    startTransition(async () => {
      await deleteRenewalAction(formData)
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-danger-200 px-4 py-2 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50 disabled:opacity-60 dark:border-danger-600/30 dark:hover:bg-danger-600/15"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
