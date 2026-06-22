import { Activity, BarChart3 } from 'lucide-react'
import { formatAmount, pluralize } from '@/lib/utils/format'
import { today } from '@/lib/utils/date'
import type { SpendAnalytics } from '@/lib/data/analytics'

interface WalletRowProps {
  analytics: SpendAnalytics
}

export function WalletRow({ analytics }: WalletRowProps) {
  const { activeSpend, totalSpend, otherActiveCurrencies, heroCurrency } = analytics
  const currentYear = today().getFullYear()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="relative overflow-hidden rounded-2xl bg-stone-900 p-4 text-white sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_0%,rgba(16,185,129,0.18),transparent)]"
        />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-xs text-stone-300 sm:mb-3 sm:text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 sm:h-6 sm:w-6">
              <Activity className="h-3.5 w-3.5" />
            </span>
            Active Spend (Annual)
          </div>
          <p className="text-xl font-bold sm:text-3xl">{formatAmount(activeSpend.amount, heroCurrency)}</p>
          <p className="mt-2 text-xs text-stone-400 sm:text-sm">
            From <strong className="text-emerald-400">{activeSpend.renewalCount} currently active</strong>{' '}
            {pluralize(activeSpend.renewalCount, 'renewal')} — what you&apos;re committed to right now.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-stone-900 p-4 text-white sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_0%,hsl(var(--primary)/0.22),transparent)]"
        />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-xs text-stone-300 sm:mb-3 sm:text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary sm:h-6 sm:w-6">
              <BarChart3 className="h-3.5 w-3.5" />
            </span>
            Total Spend (This Year)
          </div>
          <p className="text-xl font-bold sm:text-3xl">{formatAmount(totalSpend.amount, heroCurrency)}</p>
          <p className="mt-2 text-xs text-stone-400 sm:text-sm">
            From <strong className="text-primary">{totalSpend.renewalCount}</strong>{' '}
            {pluralize(totalSpend.renewalCount, 'renewal')} active at any point in {currentYear}, including
            cancelled ones.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Other currencies (active)</p>
        {otherActiveCurrencies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No other currencies among active renewals.</p>
        ) : (
          <div className="space-y-2">
            {otherActiveCurrencies.map(c => (
              <div key={c.currency} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{c.currency}</span>
                <span className="text-foreground">{formatAmount(c.amount, c.currency)} / yr</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
