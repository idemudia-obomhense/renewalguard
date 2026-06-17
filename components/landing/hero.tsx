import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.16),transparent)]"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-6xl">
          Never Miss an Important Renewal Again.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-balance text-muted-foreground sm:text-xl">
          RenewalGuard tracks your subscriptions, domains, passports, certifications, memberships,
          and every recurring obligation — then reminds you before it&apos;s too late.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-accent"
          >
            See How It Works
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
