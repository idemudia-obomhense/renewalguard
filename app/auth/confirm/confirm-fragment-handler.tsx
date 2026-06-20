'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ConfirmFragmentHandlerProps {
  next: string
}

/**
 * Supabase's default email templates route through its hosted /verify
 * endpoint, which appends the session to our redirect URL as a hash
 * fragment (#access_token=...&refresh_token=...) rather than a token_hash
 * query param. Fragments never reach the server, so this has to run
 * client-side: read the fragment, exchange it for a session via the
 * browser Supabase client (which persists sessions in cookies, so the
 * server sees it too), then move on to `next`.
 */
export function ConfirmFragmentHandler({ next }: ConfirmFragmentHandlerProps) {
  const router = useRouter()

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    if (!accessToken || !refreshToken) {
      router.replace('/login?error=invalid_or_expired_link')
      return
    }

    const supabase = createClient()
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
      router.replace(error ? '/login?error=invalid_or_expired_link' : next)
    })
  }, [next, router])

  return <p className="text-sm text-muted-foreground">Verifying your link…</p>
}
