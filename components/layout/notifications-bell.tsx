'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { markAllNotificationsReadAction, markNotificationReadAction } from '@/lib/actions/notifications'
import { formatDateRelative } from '@/lib/utils/date'
import type { Notification } from '@/types'

interface NotificationsBellProps {
  notifications: Notification[]
  unreadCount: number
}

export function NotificationsBell({ notifications, unreadCount }: NotificationsBellProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-medium text-foreground">Notifications</p>
              {unreadCount > 0 && (
                <form action={markAllNotificationsReadAction}>
                  <button type="submit" className="text-xs font-medium text-primary hover:underline">
                    Mark all read
                  </button>
                </form>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map(n => (
                  <li key={n.id}>
                    <form action={markNotificationReadAction}>
                      <input type="hidden" name="id" value={n.id} />
                      <button
                        type="submit"
                        className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left text-sm transition-colors hover:bg-accent ${
                          n.read ? '' : 'bg-primary/5'
                        }`}
                      >
                        <span className="font-medium text-foreground">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.message}</span>
                        <span className="text-[11px] text-muted-foreground/70">
                          {formatDateRelative(n.created_at)}
                        </span>
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
