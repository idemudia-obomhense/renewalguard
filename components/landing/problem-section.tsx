import { CATEGORY_META } from '@/lib/constants'
import { getIcon } from '@/lib/icon-map'
import type { RenewalCategory } from '@/types'

const PROBLEMS: { category: RenewalCategory; title: string; body: string }[] = [
  {
    category: 'domain',
    title:    'Domain',
    body:     'Your domain expires at midnight. Your website goes down. Customers can’t find you.',
  },
  {
    category: 'passport',
    title:    'Passport',
    body:     'You booked flights. Then realized your passport expired three months ago.',
  },
  {
    category: 'certification',
    title:    'Certification',
    body:     'Your professional certification lapsed. You can’t legally practice until it’s renewed.',
  },
  {
    category: 'subscription',
    title:    'Subscription',
    body:     'A tool your team relies on auto-renewed at $400. Nobody noticed for two months.',
  },
]

export function ProblemSection() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Important Things Expire. Life Gets Busy.
        </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {PROBLEMS.map(problem => {
            const meta = CATEGORY_META[problem.category]
            const Icon = getIcon(meta.icon)
            return (
              <div
                key={problem.category}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.bgColor} ${meta.darkBgColor}`}
                >
                  <Icon className={`h-5 w-5 ${meta.color} ${meta.darkColor}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{problem.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
