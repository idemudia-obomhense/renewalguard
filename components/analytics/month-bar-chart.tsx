import { formatAmount } from '@/lib/utils/format'
import type { MonthlyAmount } from '@/lib/data/analytics'

interface MonthBarChartProps {
  byMonth: MonthlyAmount[]
  heroCurrency: string
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function MonthBarChart({ byMonth, heroCurrency }: MonthBarChartProps) {
  const max = Math.max(...byMonth.map(m => m.amount), 0)

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold text-foreground">By Month</h2>
      <p className="mb-6 text-sm text-muted-foreground">When active renewals are due this year</p>

      <div className="flex items-end justify-between gap-1.5">
        {byMonth.map(({ month, amount }) => {
          const heightPct = max > 0 ? Math.max((amount / max) * 100, amount > 0 ? 6 : 3) : 3
          return (
            <div key={month} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">{formatAmount(amount, heroCurrency)}</span>
              <div className="flex h-24 w-full items-end">
                <div
                  className={`w-full rounded-t-sm ${amount > 0 ? 'bg-primary' : 'border border-dashed border-border'}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground">{MONTH_LABELS[month]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
