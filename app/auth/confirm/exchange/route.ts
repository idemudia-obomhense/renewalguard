import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles Supabase's PKCE `code` query param — confirmed via production
 * logs to be the actual format used by the password-recovery email link
 * (https://.../auth/confirm?code=...&next=/reset-password), not token_hash
 * or a hash fragment as originally assumed. Split out from /auth/confirm
 * for the same reason as ../verify/route.ts: exchangeCodeForSession sets a
 * cookie, which only a Route Handler/Server Action is allowed to do.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      redirect(next)
    }
  }

  redirect('/login?error=invalid_or_expired_link')
}
