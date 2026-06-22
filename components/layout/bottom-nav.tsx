'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'
import { getIcon } from '@/lib/icon-map'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      {NAV_ITEMS.map(item => {
        const Icon = getIcon(item.icon)
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 text-[11px] font-medium ${
              active ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? 'bg-primary/10' : ''}`}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
