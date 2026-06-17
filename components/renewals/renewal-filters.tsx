'use client'

import { useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { FILTER_LABELS, SORT_OPTIONS } from '@/lib/constants'
import type { RenewalFilter, RenewalSortKey } from '@/types'

interface RenewalFiltersProps {
  filter: RenewalFilter
  sort: RenewalSortKey
  search: string
}

const FILTER_KEYS = Object.keys(FILTER_LABELS) as RenewalFilter[]

export function RenewalFilters({ filter, sort, search }: RenewalFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(next.toString() ? `${pathname}?${next.toString()}` : pathname)
  }

  function updateSearch(value: string) {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => updateParam('search', value), 300)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {FILTER_KEYS.map(key => (
          <button
            key={key}
            type="button"
            onClick={() => updateParam('filter', key === 'all' ? '' : key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search renewals…"
            defaultValue={search}
            onChange={e => updateSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-8 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring sm:w-56"
          />
        </div>
        <select
          value={sort}
          onChange={e => updateParam('sort', e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
