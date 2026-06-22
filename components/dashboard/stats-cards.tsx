import Link from 'next/link'
import { Activity, CalendarClock, AlertTriangle, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import type { DashboardStats } from '@/types'

interface StatsCardsProps {
  stats: DashboardStats
}

const CARD_CONFIG = [
  {
    key:       'total_active' as const,
    label:     'Active Renewals',
    icon:      Activity,
    color:     'text-blue-600',
    bg:        'bg-blue-50',
    darkColor: 'dark:text-blue-400',
    darkBg:    'dark:bg-blue-950/40',
  },
  {
    key:       'due_this_month' as const,
    label:     'Due This Month',
    icon:      CalendarClock,
    color:     'text-amber-600',
    bg:        'bg-amber-50',
    darkColor: 'dark:text-amber-400',
    darkBg:    'dark:bg-amber-950/40',
  },
  {
    key:       'overdue' as const,
    label:     'Overdue',
    icon:      AlertTriangle,
    color:     'text-red-600',
    bg:        'bg-red-50',
    darkColor: 'dark:text-red-400',
    darkBg:    'dark:bg-red-950/40',
  },
]

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARD_CONFIG.map(({ key, label, icon: Icon, color, bg, darkColor, darkBg }) => (
        <div key={key} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${bg} ${color} ${darkBg} ${darkColor}`}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
          </div>
          <p className="text-xl font-semibold text-foreground sm:text-2xl">{stats[key]}</p>
        </div>
      ))}

      <Link
        href="/analytics"
        className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Est. Annual Spend</p>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 sm:h-9 sm:w-9 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Wallet className="h-[18px] w-[18px]" />
          </span>
        </div>
        <p className="text-xl font-semibold text-foreground sm:text-2xl">
          {formatCurrency(stats.estimated_spend, stats.currency)}
        </p>
        <span className="mt-auto self-end rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary sm:px-2.5 sm:text-xs">
          View Analytics →
        </span>
      </Link>
    </div>
  )
}
