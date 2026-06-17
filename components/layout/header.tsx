'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import { NotificationsBell } from './notifications-bell'
import type { Notification } from '@/types'

interface HeaderProps {
  onMenuClick: () => void
  notifications: Notification[]
  unreadCount: number
}

export function Header({ onMenuClick, notifications, unreadCount }: HeaderProps) {
  const pathname = usePathname()
  const activeItem = NAV_ITEMS.find(
    item => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )
  const title = activeItem?.label ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-[var(--spacing-header)] items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="ml-auto">
        <NotificationsBell notifications={notifications} unreadCount={unreadCount} />
      </div>
    </header>
  )
}
