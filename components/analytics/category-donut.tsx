import { CATEGORY_COLOR_HEX } from '@/lib/constants'
import { formatCategoryLabel } from '@/lib/utils/format'
import type { CategoryBreakdownRow } from '@/lib/data/analytics'

interface CategoryDonutProps {
  byCategory: CategoryBreakdownRow[]
  heroCurrency: string
}

export function CategoryDonut({ byCategory }: CategoryDonutProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold text-foreground">By Category</h2>
      <p className="mb-4 text-sm text-muted-foreground">Share of active annual spend</p>

      {byCategory.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No active renewals yet.</p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <Donut byCategory={byCategory} />
          <ul className="w-full space-y-2">
            {byCategory.map(row => (
              <li key={row.category} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLOR_HEX[row.category] }}
                  />
                  {formatCategoryLabel(row.category)}
                </span>
                <span className="font-medium text-foreground">{Math.round(row.share * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Donut({ byCategory }: { byCategory: CategoryBreakdownRow[] }) {
  const bounds = byCategory.reduce<{ start: number; end: number }[]>((acc, row) => {
    const start = acc.length > 0 ? acc[acc.length - 1].end : 0
    return [...acc, { start, end: start + row.share * 360 }]
  }, [])
  const stops = byCategory.map(
    (row, i) => `${CATEGORY_COLOR_HEX[row.category]} ${bounds[i].start}deg ${bounds[i].end}deg`,
  )
  const gradient = `conic-gradient(${stops.join(', ')})`

  return (
    <div
      className="relative h-40 w-40 shrink-0 rounded-full"
      style={{ background: gradient }}
      role="img"
      aria-label="Spend share by category"
    >
      <div className="absolute inset-[18%] rounded-full bg-card" />
    </div>
  )
}
