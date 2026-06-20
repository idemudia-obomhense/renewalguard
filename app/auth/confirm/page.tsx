import { redirect } from 'next/navigation'
import { ConfirmFragmentHandler } from './confirm-fragment-handler'

interface ConfirmPageProps {
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string; next?: string }>
}

/**
 * Single landing page for all the Supabase email-link styles we've seen:
 * - code query param (PKCE — confirmed via production logs to be what the
 *   password-recovery email actually uses) → hand off to /exchange.
 * - token_hash query param (signup confirmation today) → hand off to
 *   /verify.
 * Both handoffs exist because exchangeCodeForSession/verifyOtp set a
 * cookie, which only a Route Handler/Server Action can do — this page (a
 * Server Component) can't.
 * - neither present → falls back to the hash-fragment recovery flow
 *   (default email templates would produce this); render a client
 *   component to read it, since fragments never reach the server.
 */
export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const resolvedParams = await searchParams
  const { code, token_hash: tokenHash, type, next = '/dashboard' } = resolvedParams

  if (code) {
    const params = new URLSearchParams({ code, next })
    redirect(`/auth/confirm/exchange?${params.toString()}`)
  }

  if (tokenHash && type) {
    const params = new URLSearchParams({ token_hash: tokenHash, type, next })
    redirect(`/auth/confirm/verify?${params.toString()}`)
  }

  return <ConfirmFragmentHandler next={next} />
}
