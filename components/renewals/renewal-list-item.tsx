import Link from 'next/link'
import { CATEGORY_META } from '@/lib/constants'
import { getIcon } from '@/lib/icon-map'
import { URGENCY_DISPLAY, formatAmount, formatCategoryLabel } from '@/lib/utils/format'
import { formatDateRelative } from '@/lib/utils/date'
import type { RenewalWithUrgency } from '@/types'

interface RenewalListItemProps {
  renewal: RenewalWithUrgency
}

export function RenewalListItem({ renewal }: RenewalListItemProps) {
  const category = CATEGORY_META[renewal.category]
  const Icon = getIcon(category.icon)
  const urgency = URGENCY_DISPLAY[renewal.urgency]
  const isResolved = renewal.urgency === 'archived' || renewal.urgency === 'completed'

  return (
    <Link
      href={`/renewals/${renewal.id}`}
      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-accent sm:gap-4 sm:p-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${category.bgColor} ${category.color} ${category.darkBgColor} ${category.darkColor}`}
        >
          {/* getIcon resolves an existing lucide-react component from a static lookup table, not a new definition. */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{renewal.title}</p>
          <p className="text-xs text-muted-foreground">{formatCategoryLabel(renewal.category)}</p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${urgency.bgColor} ${urgency.color} ${urgency.darkBgColor} ${urgency.darkColor}`}
        >
          {isResolved ? urgency.label : formatDateRelative(renewal.renewal_date)}
        </span>
        {renewal.amount != null && (
          <span className="text-xs text-muted-foreground">
            {formatAmount(renewal.amount, renewal.currency)}
          </span>
        )}
      </div>
    </Link>
  )
}
