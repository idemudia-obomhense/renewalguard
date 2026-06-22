import { CATEGORY_META } from '@/lib/constants'
import { getIcon } from '@/lib/icon-map'
import { formatAmount, formatCategoryLabel, pluralize } from '@/lib/utils/format'
import type { CategoryBreakdownRow } from '@/lib/data/analytics'

interface CategoryBreakdownTableProps {
  byCategory: CategoryBreakdownRow[]
  heroCurrency: string
}

export function CategoryBreakdownTable({ byCategory, heroCurrency }: CategoryBreakdownTableProps) {
  const totalCount = byCategory.reduce((s, r) => s + r.count, 0)
  const totalAmount = byCategory.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="text-base font-semibold text-foreground">Breakdown by Category</h2>
        <span className="text-xs text-muted-foreground sm:text-sm">
          {byCategory.length} {pluralize(byCategory.length, 'category', 'categories')}
        </span>
      </div>

      {byCategory.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">No active renewals yet.</p>
      ) : (
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-muted/40 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <th className="px-3 py-2 text-left sm:px-6 sm:py-3">Category</th>
              <th className="px-3 py-2 text-right sm:px-6 sm:py-3">Renewals</th>
              <th className="px-3 py-2 text-right sm:px-6 sm:py-3">Annual Spend</th>
              <th className="px-3 py-2 text-right sm:px-6 sm:py-3">Share</th>
            </tr>
          </thead>
          <tbody>
            {byCategory.map(row => {
              const meta = CATEGORY_META[row.category]
              const Icon = getIcon(meta.icon)
              const pct = Math.round(row.share * 100)
              return (
                <tr key={row.category} className="border-t border-border">
                  <td className="px-3 py-2 sm:px-6 sm:py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${meta.bgColor} ${meta.color} ${meta.darkBgColor} ${meta.darkColor}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-foreground">{formatCategoryLabel(row.category)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right text-foreground sm:px-6 sm:py-3">{row.count}</td>
                  <td className="px-3 py-2 text-right text-foreground sm:px-6 sm:py-3">
                    {formatAmount(row.amount, heroCurrency)}
                  </td>
                  <td className="px-3 py-2 text-right sm:px-6 sm:py-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-10 text-foreground">{pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/40 font-semibold">
              <td className="px-3 py-2 text-foreground sm:px-6 sm:py-3">Total</td>
              <td className="px-3 py-2 text-right text-foreground sm:px-6 sm:py-3">{totalCount}</td>
              <td className="px-3 py-2 text-right text-foreground sm:px-6 sm:py-3">
                {formatAmount(totalAmount, heroCurrency)}
              </td>
              <td className="px-3 py-2 sm:px-6 sm:py-3" />
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}
