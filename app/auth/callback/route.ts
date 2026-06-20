import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles PKCE code-exchange links (OAuth providers). Not used by the
 * email/password flow today, but kept so OAuth can be added later without
 * touching the redirect URLs already configured in the Supabase dashboard.
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
