import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles email OTP links (signup confirmation, password recovery, magic link).
 * Supabase sends these as ?token_hash=...&type=...&next=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

    if (!error) {
      redirect(next)
    }
  }

  redirect('/login?error=invalid_or_expired_link')
}
