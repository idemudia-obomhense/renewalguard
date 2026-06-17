import Link from 'next/link'
import { Check } from 'lucide-react'

const FREE_FEATURES = ['Up to 13 renewals', 'Email reminders', 'Dashboard access', 'All categories']

const PRO_FEATURES = [
  'Unlimited renewals',
  'Priority email reminders',
  'Advanced filters and search',
  'Cost tracking and reporting',
  'Early access to new features',
]

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Simple, Honest Pricing.
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">Free Plan</p>
            <p className="mt-2 text-4xl font-bold text-foreground">
              $0<span className="text-base font-medium text-muted-foreground">/month</span>
            </p>
            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map(feature => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
            >
              Start Free — No credit card needed
            </Link>
          </div>

          <div className="relative rounded-2xl border border-border bg-card p-8 shadow-sm">
            <span className="absolute -top-3 right-8 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Coming soon
            </span>
            <p className="text-sm font-semibold text-muted-foreground">Pro Plan</p>
            <p className="mt-2 text-4xl font-bold text-foreground">
              $9<span className="text-base font-medium text-muted-foreground">/month</span>
            </p>
            <ul className="mt-6 space-y-3">
              {PRO_FEATURES.map(feature => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled
              className="mt-8 block w-full cursor-not-allowed rounded-full border border-border px-5 py-3 text-center text-sm font-semibold text-muted-foreground"
            >
              Coming soon
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
