import { TrendingUp, Bell, DollarSign, ShieldCheck } from 'lucide-react'
import { CATEGORY_META } from '@/lib/constants'
import { URGENCY_DISPLAY } from '@/lib/utils/format'
import { getIcon } from '@/lib/icon-map'
import type { RenewalCategory, RenewalUrgency } from '@/types'

interface MockStat {
  label: string
  value: string
}

const MOCK_STATS: MockStat[] = [
  { label: 'Active Renewals',     value: '12'     },
  { label: 'Due This Month',      value: '3'      },
  { label: 'Overdue',             value: '1'      },
  { label: 'Est. Annual Spend',   value: '$1,284' },
]

interface MockRenewal {
  title:    string
  category: RenewalCategory
  urgency:  RenewalUrgency
  due:      string
  amount:   string
}

const MOCK_RENEWALS: MockRenewal[] = [
  { title: 'AWS Hosting',                category: 'subscription',     urgency: 'expiring_soon', due: 'in 7 days',        amount: '$89.00'  },
  { title: 'mycompany.com',              category: 'domain',           urgency: 'overdue',       due: '3 days overdue',  amount: '—'       },
  { title: 'PMP Certification',          category: 'certification',    urgency: 'active',        due: 'in 142 days',     amount: '—'       },
  { title: 'Business Operating Permit',  category: 'business_permit',  urgency: 'active',        due: 'in 60 days',      amount: '$250.00' },
]

const CALLOUTS = [
  { icon: TrendingUp,  text: 'Upcoming renewals sorted by urgency'              },
  { icon: Bell,        text: 'Smart reminders sent to your inbox'               },
  { icon: DollarSign,  text: 'Cost tracking across all your renewals'           },
  { icon: ShieldCheck, text: 'Status badges — Active, Expiring Soon, Overdue'   },
]

export function DashboardShowcase() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Your Entire Renewal Calendar. In One View.
        </h2>

        <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="mx-auto rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">
              renewalguard.app/dashboard
            </span>
          </div>

          <div className="p-5 sm:p-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MOCK_STATS.map(stat => (
                <div key={stat.label} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm font-semibold text-foreground">Upcoming Renewals</p>
            <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-background">
              {MOCK_RENEWALS.map(renewal => {
                const categoryMeta = CATEGORY_META[renewal.category]
                const urgencyMeta = URGENCY_DISPLAY[renewal.urgency]
                const CategoryIcon = getIcon(categoryMeta.icon)
                return (
                  <div key={renewal.title} className="flex items-center gap-3 px-4 py-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${categoryMeta.bgColor} ${categoryMeta.darkBgColor}`}
                    >
                      <CategoryIcon className={`h-4 w-4 ${categoryMeta.color} ${categoryMeta.darkColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{renewal.title}</p>
                      <p className="text-xs text-muted-foreground">{renewal.due}</p>
                    </div>
                    <span
                      className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline ${urgencyMeta.bgColor} ${urgencyMeta.color} ${urgencyMeta.darkBgColor} ${urgencyMeta.darkColor}`}
                    >
                      {urgencyMeta.label}
                    </span>
                    <span className="shrink-0 text-sm font-medium text-foreground">{renewal.amount}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CALLOUTS.map(callout => {
            const Icon = callout.icon
            return (
              <div key={callout.text} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">{callout.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
