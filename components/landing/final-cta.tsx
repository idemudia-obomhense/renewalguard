import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[480px] -translate-y-1/2 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,hsl(var(--primary)/0.14),transparent)]"
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Stop Losing Money and Opportunities to Missed Renewals.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of professionals and businesses who never miss a renewal deadline.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
        >
          Get Started Free — It takes 2 minutes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
