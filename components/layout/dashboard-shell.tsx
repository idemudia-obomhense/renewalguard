import { Sidebar } from './sidebar'
import { Header } from './header'
import { BottomNav } from './bottom-nav'
import type { Notification, Profile } from '@/types'

interface DashboardShellProps {
  profile: Profile | null
  notifications: Notification[]
  unreadCount: number
  children: React.ReactNode
}

export function DashboardShell({ profile, notifications, unreadCount, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar profile={profile} />
      <div className="flex min-h-screen flex-col md:pl-[var(--spacing-sidebar)]">
        <Header notifications={notifications} unreadCount={unreadCount} />
        <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6 lg:p-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
