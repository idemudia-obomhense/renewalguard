'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, X } from 'lucide-react'
import { NAV_ITEMS, APP_NAME } from '@/lib/constants'
import { getIcon } from '@/lib/icon-map'
import { signOutAction } from '@/lib/actions/auth'
import { initials } from '@/lib/utils/format'
import type { Profile } from '@/types'

interface SidebarProps {
  profile: Profile | null
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ profile, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[var(--spacing-sidebar)] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[var(--spacing-header)] items-center justify-between px-6">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
              R
            </span>
            {APP_NAME}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(item => {
            const Icon = getIcon(item.icon)
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
              {initials(profile?.full_name || 'You')}
            </span>
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {profile?.full_name || 'Account'}
            </p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
