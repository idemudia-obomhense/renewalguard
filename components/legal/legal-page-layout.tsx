import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import { Footer } from '@/components/landing/footer'

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            R
          </span>
          {APP_NAME}
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8">{children}</div>
      </main>

      <Footer />
    </div>
  )
}
