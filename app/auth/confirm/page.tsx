import { redirect } from 'next/navigation'
import { ConfirmFragmentHandler } from './confirm-fragment-handler'

interface ConfirmPageProps {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>
}

/**
 * Single landing page for both Supabase email-link styles:
 * - token_hash query param (signup confirmation today) → hand off to the
 *   /verify Route Handler, which can set cookies; this page (a Server
 *   Component) can't.
 * - no token_hash → likely the hash-fragment recovery flow (default email
 *   templates); render a client component to read it, since fragments
 *   never reach the server.
 */
export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { token_hash: tokenHash, type, next = '/dashboard' } = await searchParams

  if (tokenHash && type) {
    const params = new URLSearchParams({ token_hash: tokenHash, type, next })
    redirect(`/auth/confirm/verify?${params.toString()}`)
  }

  return <ConfirmFragmentHandler next={next} />
}
