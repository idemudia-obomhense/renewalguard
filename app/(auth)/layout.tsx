import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-muted px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-semibold text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
          R
        </span>
        {APP_NAME}
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        {children}
      </div>
    </div>
  )
}
