import { KeyRound, Plus, Bell } from 'lucide-react'

const STEPS = [
  {
    icon:  KeyRound,
    step:  '1',
    title: 'Create your free account',
    body:  'Sign up in seconds. No credit card required.',
  },
  {
    icon:  Plus,
    step:  '2',
    title: 'Add your renewals',
    body:  'Enter your renewal name, date, category, and how early you want to be reminded.',
  },
  {
    icon:  Bell,
    step:  '3',
    title: 'We handle the rest',
    body:  'RenewalGuard tracks every deadline and sends you email reminders automatically.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Up and running in 3 minutes.
        </h2>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {STEPS.map(step => {
            const Icon = step.icon
            return (
              <div key={step.step} className="relative flex flex-col items-center text-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest text-primary/60 uppercase">
                  Step {step.step}
                </span>
                <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
