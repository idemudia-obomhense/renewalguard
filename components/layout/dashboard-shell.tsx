'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import type { Notification, Profile } from '@/types'

interface DashboardShellProps {
  profile: Profile | null
  notifications: Notification[]
  unreadCount: number
  children: React.ReactNode
}

export function DashboardShell({ profile, notifications, unreadCount, children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar profile={profile} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-h-screen flex-col md:pl-[var(--spacing-sidebar)]">
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          notifications={notifications}
          unreadCount={unreadCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
