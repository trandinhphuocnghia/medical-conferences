import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Rate Limiter (lazy-init, skipped if env vars missing) ──────────────────
let ratelimit: Ratelimit | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // 20 requests per 10-second sliding window
    limiter: Ratelimit.slidingWindow(20, '10 s'),// [Check]: SLIDING WINDOW
    analytics: true,
    prefix: 'ratelimit:mw',
  })
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname + request.nextUrl.search)

  // ── Rate Limiting ──────────────────────────────────────────────────────
  if (ratelimit) {
    try {
      const ip = getClientIp(request)
      const { success, limit, reset } = await ratelimit.limit(ip)

      if (!success) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
          },
        })
      }
    } catch (error) {
      // If Redis is unreachable, log and allow the request through
      console.error('Rate limiter error:', error)
    }
  }

  // ── Redirect default Payload login to custom signin page ───────────────
  if (pathname === '/dashboard/login') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Get the payload-token cookie
  const token = request.cookies.get('payload-token')?.value

  // ONLY check auth on login/signup pages to avoid redundant fetches on every page
  const isAuthPage = pathname === '/signup' || pathname === '/signin'

  if (token && isAuthPage) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || request.nextUrl.origin

      const response = await fetch(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        const { user } = await response.json()

        if (user) {
          if (user.role === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }
          return NextResponse.redirect(new URL('/dashboard/account', request.url))
        }
      }
    } catch (error) {
      console.error('Middleware auth check error:', error)
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

