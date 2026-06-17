import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Archive, ArchiveRestore, CheckCircle2, Pencil } from 'lucide-react'
import { getRenewalById } from '@/lib/data/renewals'
import { archiveRenewalAction, completeRenewalAction, restoreRenewalAction } from '@/lib/actions/renewals'
import { DeleteRenewalButton } from '@/components/renewals/delete-renewal-button'
import { CATEGORY_META } from '@/lib/constants'
import { getIcon } from '@/lib/icon-map'
import {
  URGENCY_DISPLAY,
  formatAmount,
  formatCategoryLabel,
  formatFrequencyLabel,
  formatReminderDays,
  formatStatusLabel,
} from '@/lib/utils/format'
import { computeUrgency, formatDate, getDaysRemaining } from '@/lib/utils/date'

interface RenewalDetailPageProps {
  params: Promise<{ id: string }>
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  )
}

export default async function RenewalDetailPage({ params }: RenewalDetailPageProps) {
  const { id } = await params
  const renewal = await getRenewalById(id)

  if (!renewal) notFound()

  const category = CATEGORY_META[renewal.category]
  const Icon = getIcon(category.icon)
  const urgency = URGENCY_DISPLAY[computeUrgency(renewal)]
  const daysRemaining = getDaysRemaining(renewal.renewal_date)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.bgColor} ${category.color} ${category.darkBgColor} ${category.darkColor}`}
          >
            {/* getIcon resolves an existing lucide-react component from a static lookup table, not a new definition. */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{renewal.title}</h2>
            <p className="text-sm text-muted-foreground">{formatCategoryLabel(renewal.category)}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${urgency.bgColor} ${urgency.color} ${urgency.darkBgColor} ${urgency.darkColor}`}
        >
          {urgency.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <DetailField label="Renewal date" value={formatDate(renewal.renewal_date)} />
        <DetailField
          label="Days remaining"
          value={daysRemaining >= 0 ? `${daysRemaining} days` : `${Math.abs(daysRemaining)} days overdue`}
        />
        <DetailField label="Frequency" value={formatFrequencyLabel(renewal.frequency)} />
        <DetailField label="Amount" value={formatAmount(renewal.amount, renewal.currency)} />
        <DetailField label="Status" value={formatStatusLabel(renewal.status)} />
        <DetailField label="Reminders" value={formatReminderDays(renewal.reminder_days)} />
      </div>

      {renewal.notes && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-medium text-foreground">Notes</h3>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{renewal.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/renewals/${renewal.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>

        {renewal.status === 'active' && (
          <>
            <form action={completeRenewalAction}>
              <input type="hidden" name="id" value={renewal.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </button>
            </form>
            <form action={archiveRenewalAction}>
              <input type="hidden" name="id" value={renewal.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
            </form>
          </>
        )}

        {renewal.status === 'archived' && (
          <form action={restoreRenewalAction}>
            <input type="hidden" name="id" value={renewal.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <ArchiveRestore className="h-4 w-4" />
              Restore
            </button>
          </form>
        )}

        <DeleteRenewalButton id={renewal.id} />
      </div>
    </div>
  )
}
