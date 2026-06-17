import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    question: 'What types of renewals can I track?',
    answer:   'Anything with an expiry date — subscriptions, domains, passports, visas, certifications, memberships, insurance, business permits, tax deadlines, and more.',
  },
  {
    question: 'How do reminders work?',
    answer:   'You choose how many days before the renewal date you want to be reminded — 30, 14, 7, 3, or 1 day. We send a clean email reminder automatically.',
  },
  {
    question: 'Is my data secure?',
    answer:   'Yes. All data is encrypted, stored securely, and never shared with third parties. You can delete your account and all data at any time.',
  },
  {
    question: 'Do I need a credit card to sign up?',
    answer:   'No. The free plan is completely free with no credit card required.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:   'Yes. No contracts, no lock-in. Cancel or downgrade anytime from your settings.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Frequently Asked Questions.
        </h2>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map(faq => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
