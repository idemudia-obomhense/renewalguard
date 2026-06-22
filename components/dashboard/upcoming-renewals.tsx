import Link from 'next/link'
import { CalendarClock } from 'lucide-react'
import { RenewalListItem } from '@/components/renewals/renewal-list-item'
import type { RenewalWithUrgency } from '@/types'

interface UpcomingRenewalsProps {
  renewals: RenewalWithUrgency[]
}

export function UpcomingRenewals({ renewals }: UpcomingRenewalsProps) {
  if (renewals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-10">
        <CalendarClock className="mx-auto mb-3 h-6 w-6 text-muted-foreground sm:h-8 sm:w-8" />
        <p className="mb-1 text-sm font-medium text-foreground">No upcoming renewals</p>
        <p className="mb-4 text-sm text-muted-foreground">
          Add your first renewal to start tracking deadlines.
        </p>
        <Link
          href="/renewals/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add a renewal
        </Link>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card">
      {renewals.map(renewal => (
        <RenewalListItem key={renewal.id} renewal={renewal} />
      ))}
    </div>
  )
}
