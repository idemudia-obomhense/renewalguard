import { getDashboardStats, getUpcomingRenewals } from '@/lib/data/dashboard'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { UpcomingRenewals } from '@/components/dashboard/upcoming-renewals'

export default async function DashboardPage() {
  const [stats, upcoming] = await Promise.all([
    getDashboardStats(),
    getUpcomingRenewals(),
  ])

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />

      <section>
        <h2 className="mb-4 text-base font-semibold text-foreground">Upcoming Renewals</h2>
        <UpcomingRenewals renewals={upcoming} />
      </section>
    </div>
  )
}
