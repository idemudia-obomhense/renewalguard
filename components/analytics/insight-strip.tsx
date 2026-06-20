import { Lightbulb } from 'lucide-react'
import { formatAmount } from '@/lib/utils/format'
import type { SpendAnalytics } from '@/lib/data/analytics'

interface InsightStripProps {
  analytics: SpendAnalytics
}

// Only worth calling out once the gap is large enough to not just be
// rounding noise — 5% of total spend is the threshold for "meaningful."
const MEANINGFUL_GAP_RATIO = 0.05

export function InsightStrip({ analytics }: InsightStripProps) {
  const { activeSpend, totalSpend } = analytics
  const gap = totalSpend.amount - activeSpend.amount
  const meaningfulGap = totalSpend.amount > 0 && gap / totalSpend.amount >= MEANINGFUL_GAP_RATIO

  if (!meaningfulGap) return null

  const cancelledCount = Math.max(totalSpend.renewalCount - activeSpend.renewalCount, 0)

  return (
    <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <strong>{cancelledCount}</strong> {cancelledCount === 1 ? 'renewal was' : 'renewals were'} cancelled or
        completed this year — your active spend ({formatAmount(activeSpend.amount, analytics.heroCurrency)}) is
        lower than your total spend ({formatAmount(totalSpend.amount, analytics.heroCurrency)}).
      </p>
    </div>
  )
}
