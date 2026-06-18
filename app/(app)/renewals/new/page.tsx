import { RenewalForm } from '@/components/renewals/renewal-form'
import { createRenewalAction } from '@/lib/actions/renewals'
import { getProfile } from '@/lib/data/profile'

export default async function NewRenewalPage() {
  const profile = await getProfile()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Add a renewal</h2>
        <p className="text-sm text-muted-foreground">Track a new subscription, document, or deadline.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <RenewalForm
          action={createRenewalAction}
          submitLabel="Create renewal"
          defaultReminderDays={profile?.default_reminder_days}
          defaultCurrency={profile?.currency}
        />
      </div>
    </div>
  )
}
