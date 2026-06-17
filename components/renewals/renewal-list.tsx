import { Inbox } from 'lucide-react'
import { RenewalListItem } from './renewal-list-item'
import type { RenewalWithUrgency } from '@/types'

interface RenewalListProps {
  renewals: RenewalWithUrgency[]
}

export function RenewalList({ renewals }: RenewalListProps) {
  if (renewals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <Inbox className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium text-foreground">No renewals found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search.</p>
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
