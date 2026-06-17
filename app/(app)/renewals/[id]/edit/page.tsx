import { notFound } from 'next/navigation'
import { getRenewalById } from '@/lib/data/renewals'
import { RenewalForm } from '@/components/renewals/renewal-form'
import { updateRenewalAction } from '@/lib/actions/renewals'

interface EditRenewalPageProps {
  params: Promise<{ id: string }>
}

export default async function EditRenewalPage({ params }: EditRenewalPageProps) {
  const { id } = await params
  const renewal = await getRenewalById(id)

  if (!renewal) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Edit renewal</h2>
        <p className="text-sm text-muted-foreground">Update the details for {renewal.title}.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <RenewalForm action={updateRenewalAction} renewal={renewal} submitLabel="Save changes" />
      </div>
    </div>
  )
}
