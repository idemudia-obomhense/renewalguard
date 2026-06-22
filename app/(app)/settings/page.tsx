import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProfile } from '@/lib/data/profile'
import { ProfileForm } from '@/components/settings/profile-form'
import { PreferencesForm } from '@/components/settings/preferences-form'

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>
}

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'preferences', label: 'Preferences' },
] as const

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { tab = 'profile' } = await searchParams
  const profile = await getProfile()

  if (!profile) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground sm:text-lg">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map(t => (
          <Link
            key={t.key}
            href={`/settings?tab=${t.key}`}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        {tab === 'preferences' ? <PreferencesForm profile={profile} /> : <ProfileForm profile={profile} />}
      </div>
    </div>
  )
}
