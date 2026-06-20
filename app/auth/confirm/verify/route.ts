import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles email OTP links (signup confirmation, password recovery, magic link)
 * that arrive with a server-readable `token_hash` query param. Split out from
 * /auth/confirm so that path can also dispatch to a client component for the
 * hash-fragment recovery flow (see ../confirm-fragment-handler.tsx) without
 * losing the ability to set cookies here, which only Route Handlers/Server
 * Actions are allowed to do.
 */
export async function GET(request: NextRequest) {
  console.log('[DEBUG /auth/confirm/verify] full incoming URL:', request.nextUrl.toString())
  console.log('[DEBUG /auth/confirm/verify] referer header:', request.headers.get('referer'))

  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    console.log('[DEBUG /auth/confirm/verify] verifyOtp result:', error ? `ERROR: ${error.message}` : 'success')

    if (!error) {
      redirect(next)
    }
  } else {
    console.log('[DEBUG /auth/confirm/verify] missing token_hash or type — should not normally happen, page.tsx only redirects here when both are present')
  }

  redirect('/login?error=invalid_or_expired_link')
}
