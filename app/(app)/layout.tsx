import { getProfile } from '@/lib/data/profile'
import { getNotifications, getUnreadNotificationCount } from '@/lib/data/notifications'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, notifications, unreadCount] = await Promise.all([
    getProfile(),
    getNotifications(),
    getUnreadNotificationCount(),
  ])

  return (
    <DashboardShell profile={profile} notifications={notifications} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  )
}
