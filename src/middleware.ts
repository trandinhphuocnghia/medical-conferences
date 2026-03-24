import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// ── JWT secret ─────────────────────────────────────────────────────────────
// Payload internally derives the actual signing secret from the config secret:
//   crypto.createHash('sha256').update(secret).digest('hex').slice(0, 32)
// (see: payload/dist/index.js → this.secret = ...)
// We must replicate this derivation in the Edge Runtime using crypto.subtle.
let _jwtSecret: Uint8Array | null = null

async function getJwtSecret(): Promise<Uint8Array> {
  if (_jwtSecret) return _jwtSecret

  const rawSecret = process.env.PAYLOAD_SECRET || ''
  const msgBuffer = new TextEncoder().encode(rawSecret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  // Payload slices to first 32 hex characters
  const derivedSecret = hashHex.slice(0, 32)

  _jwtSecret = new TextEncoder().encode(derivedSecret)
  return _jwtSecret
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname + request.nextUrl.search)

  // Redirect default Payload login to custom signin page
  if (pathname === '/dashboard/login') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // ── Stateless auth redirect for login/signup pages ─────────────────────
  // If the user already has a valid JWT, redirect them away from auth pages.
  // Uses jose.jwtVerify() at the Edge — zero network calls, zero DB queries.
  const isAuthPage = pathname === '/signup' || pathname === '/signin'

  if (isAuthPage) {
    const token = request.cookies.get('payload-token')?.value

    if (token) {
      try {
        const secret = await getJwtSecret()
        const { payload } = await jwtVerify(token, secret)

        // The 'role' field is saved to JWT via `saveToJWT: true` in the Users collection
        const role = payload.role as string | undefined

        if (role === 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // Any valid authenticated user (modifier, user, etc.)
        return NextResponse.redirect(new URL('/dashboard/account', request.url))
      } catch {
        // Invalid/expired token — let the user through to the auth page.
        // Clear the stale cookie so they aren't stuck:
        const response = NextResponse.next({ request: { headers: requestHeaders } })
        response.cookies.delete('payload-token')
        return response
      }
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)',
  ],
}
