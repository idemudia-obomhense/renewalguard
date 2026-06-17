import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getRenewals } from '@/lib/data/renewals'
import { RenewalFilters } from '@/components/renewals/renewal-filters'
import { RenewalList } from '@/components/renewals/renewal-list'
import type { RenewalFilter, RenewalSortKey } from '@/types'

interface RenewalsPageProps {
  searchParams: Promise<{ filter?: string; sort?: string; search?: string }>
}

export default async function RenewalsPage({ searchParams }: RenewalsPageProps) {
  const params = await searchParams
  const filter = (params.filter ?? 'all') as RenewalFilter
  const sort = (params.sort ?? 'due_date') as RenewalSortKey
  const search = params.search ?? ''

  const renewals = await getRenewals({ filter, sort, search })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">All Renewals</h2>
        <Link
          href="/renewals/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Renewal
        </Link>
      </div>

      <RenewalFilters filter={filter} sort={sort} search={search} />

      <RenewalList renewals={renewals} />
    </div>
  )
}
