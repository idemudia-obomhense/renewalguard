import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-xl font-semibold text-foreground">This page no longer exists</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        It may have been deleted, or the link is out of date.
      </p>
      <Link
        href="/dashboard"
        className="mt-3 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
