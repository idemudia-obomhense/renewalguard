import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/* ── Route groups ───────────────────────────────────────────────────────── */

const PUBLIC_PATHS = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/auth/callback', '/auth/confirm', '/privacy', '/terms']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))
}

/* ── Proxy ──────────────────────────────────────────────────────────────── */

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Forward cookies to the response so the browser receives them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the session — MUST await before any redirect/response logic
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Unauthenticated user hitting a protected route → redirect to login
  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user hitting auth pages → redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.search = ''
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Run proxy on all routes except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public folder files (svg, png, etc.)
     * - /api/cron/* (authenticates itself via CRON_SECRET, not user cookies)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
