import { CalendarClock, Bell, LayoutDashboard } from 'lucide-react'

const FEATURES = [
  {
    icon:  CalendarClock,
    title: 'Track Renewals',
    body:  'Add any renewal in seconds. Subscriptions, documents, licenses, domains — if it expires, RenewalGuard tracks it.',
  },
  {
    icon:  Bell,
    title: 'Get Reminders',
    body:  'Choose exactly when to be reminded — 30 days, 7 days, 1 day before. Never be caught off guard again.',
  },
  {
    icon:  LayoutDashboard,
    title: 'Stay Organized',
    body:  'One clean dashboard showing everything at a glance. See what’s active, what’s expiring, what’s overdue, and what it all costs.',
  },
]

export function SolutionSection() {
  return (
    <section id="features" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          One Place For Everything That Matters.
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {FEATURES.map(feature => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex flex-col items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
