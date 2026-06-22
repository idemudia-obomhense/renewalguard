'use client'

import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'
import { NotificationsBell } from './notifications-bell'
import type { Notification } from '@/types'

interface HeaderProps {
  notifications: Notification[]
  unreadCount: number
}

export function Header({ notifications, unreadCount }: HeaderProps) {
  const pathname = usePathname()
  const activeItem = NAV_ITEMS.find(
    item => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )
  const title = activeItem?.label ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-[var(--spacing-header)] items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="ml-auto">
        <NotificationsBell notifications={notifications} unreadCount={unreadCount} />
      </div>
    </header>
  )
}
