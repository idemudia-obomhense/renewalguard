import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

const FOOTER_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#' },
  { label: 'Contact', href: '#' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              R
            </span>
            {APP_NAME}
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">Never miss a renewal deadline again.</p>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-6 text-sm">
          <div>
            <p className="font-semibold text-foreground">Product</p>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Legal</p>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground">
        © 2026 {APP_NAME}. All rights reserved.
      </p>
    </footer>
  )
}
