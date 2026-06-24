/**
 * ============================================================
 * EXPERIMENTAL — PHASE 1 FEATURE
 * ============================================================
 * This file adds HTTP Basic Authentication to protect the
 * development environment from accidental public access and
 * search engine indexing.
 *
 * STATUS:   Experimental. Subject to change or removal if this
 *           approach does not fit the team's workflow.
 *
 * REMOVAL:  This feature is fully self-contained. If it is no
 *           longer needed, delete this file entirely. No other
 *           file in the codebase depends on the Basic Auth
 *           logic added here.
 * ============================================================
 */

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

// ── [EXPERIMENTAL] Basic Auth gate ─────────────────────────────────────────
// Only active when APP_ENV === 'development'.
// Reads credentials from DEV_USER and DEV_PASSWORD environment variables.
// Returns a 401 response that triggers the browser's native login popup when
// credentials are missing or incorrect.
function applyBasicAuth(request: NextRequest): NextResponse | null {
  // Guard: only protect development deployments
  if (process.env.APP_ENV !== 'development') return null

  const devUser = process.env.DEV_USER ?? ''
  const devPassword = process.env.DEV_PASSWORD ?? ''

  // Read the Authorization header sent by the browser
  const authHeader = request.headers.get('authorization') ?? ''

  if (authHeader.startsWith('Basic ')) {
    try {
      // Decode base64 "username:password"
      const base64Credentials = authHeader.slice('Basic '.length)
      const decoded = atob(base64Credentials)
      const colonIndex = decoded.indexOf(':')

      if (colonIndex !== -1) {
        const submittedUser = decoded.slice(0, colonIndex)
        const submittedPassword = decoded.slice(colonIndex + 1)

        if (submittedUser === devUser && submittedPassword === devPassword) {
          // Credentials are valid — allow the request through
          return null
        }
      }
    } catch {
      // Malformed base64 — fall through to 401
    }
  }

  // Missing or invalid credentials — prompt the browser login popup
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Development Environment", charset="UTF-8"',
    },
  })
}

export async function middleware(request: NextRequest) {
  // ── [EXPERIMENTAL] Development Basic Auth ──────────────────────────────
  // This block is the only place Basic Auth logic lives.
  // Removing the `applyBasicAuth` call (and the function above) is sufficient
  // to disable this feature completely.
  const basicAuthResponse = applyBasicAuth(request)
  if (basicAuthResponse) return basicAuthResponse

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
     * Match all request paths EXCEPT:
     * - api/health      - Bypass for Railway Health Check
     * - _next/static    - compiled static assets
     * - _next/image     - Next.js image optimization endpoint
     * - favicon.ico     - browser favicon requests
     * - Any path ending in a file extension (e.g. .png, .svg, .woff2)
     */
    '/((?!api/health|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)',
  ],
};
