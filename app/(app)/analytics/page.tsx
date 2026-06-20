import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSpendAnalytics } from '@/lib/data/analytics'
import { InsightStrip } from '@/components/analytics/insight-strip'
import { WalletRow } from '@/components/analytics/wallet-row'
import { CategoryDonut } from '@/components/analytics/category-donut'
import { MonthBarChart } from '@/components/analytics/month-bar-chart'
import { CategoryBreakdownTable } from '@/components/analytics/category-breakdown-table'

export default async function AnalyticsPage() {
  const analytics = await getSpendAnalytics()

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Spend Analytics</h1>
      </div>
      <div className="border-t border-border" />

      <InsightStrip analytics={analytics} />

      <WalletRow analytics={analytics} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryDonut byCategory={analytics.byCategory} heroCurrency={analytics.heroCurrency} />
        <MonthBarChart byMonth={analytics.byMonth} heroCurrency={analytics.heroCurrency} />
      </div>

      <CategoryBreakdownTable byCategory={analytics.byCategory} heroCurrency={analytics.heroCurrency} />
    </div>
  )
}
