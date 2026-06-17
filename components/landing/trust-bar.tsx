import { CATEGORY_META } from '@/lib/constants'
import { getIcon } from '@/lib/icon-map'
import type { RenewalCategory } from '@/types'

const TRUST_CATEGORIES: { category: RenewalCategory; label: string }[] = [
  { category: 'subscription',     label: 'Subscriptions'    },
  { category: 'domain',           label: 'Domains'          },
  { category: 'passport',         label: 'Passports'        },
  { category: 'visa',             label: 'Visas'             },
  { category: 'certification',    label: 'Certifications'   },
  { category: 'membership',       label: 'Memberships'      },
  { category: 'business_permit', label: 'Business Permits' },
  { category: 'insurance',        label: 'Insurance'        },
  { category: 'tax',              label: 'Tax Deadlines'    },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/40 px-6 py-10">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Trusted for tracking
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {TRUST_CATEGORIES.map(({ category, label }) => {
            const Icon = getIcon(CATEGORY_META[category].icon)
            return (
              <span
                key={category}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
