/**
 * ============================================================
 * MIDDLEWARE — Composed Stack
 * ============================================================
 *
 * Execution order:
 *   1. [EXPERIMENTAL] Basic Auth gate (dev-only environment guard)
 *   2. Payload Dashboard guard — short-circuits ALL /dashboard/* requests
 *      before next-intl ever sees them. Only /dashboard/login is redirected
 *      to the custom /signin page; every other /dashboard/* path passes
 *      through untouched so Payload Admin Panel internals are never affected.
 *   3. next-intl routing middleware (locale detection & redirect)
 *   4. Custom app logic:
 *        - Forward x-pathname header
 *        - Stateless JWT redirect for /signin & /signup
 *
 * REMOVAL:
 *   • Basic Auth: Remove the `applyBasicAuth` call and its function body.
 *   • i18n: Remove the `intlMiddleware` call and createMiddleware import.
 *     Revert the matcher to the original single-pattern form.
 * ============================================================
 */

import { jwtVerify } from 'jose'
import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// ── next-intl routing middleware ────────────────────────────────────────────
const intlMiddleware = createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
})

// ── JWT secret ─────────────────────────────────────────────────────────────
// Payload internally derives the actual signing secret from the config secret:
//   crypto.createHash('sha256').update(secret).digest('hex').slice(0, 32)
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

  // ── Payload Dashboard guard ─────────────────────────────────────────────
  // ALL /dashboard/* paths belong to the Payload CMS Admin Panel.
  // They must NEVER be touched by the next-intl locale middleware — intl
  // must not add a locale prefix (e.g. /vi/dashboard/logout would 404).
  //
  // We intercept them here, before intlMiddleware runs:
  //   • /dashboard/login  → redirect to our custom /signin page.
  //   • Everything else   → pass through as-is, no locale injection.
  if (pathname.startsWith('/dashboard')) {
    if (pathname === '/dashboard/login') {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    return NextResponse.next()
  }

  // ── next-intl locale routing ────────────────────────────────────────────
  // Run the intl middleware to get its response (locale redirect or rewrite).
  // • If it returns a REDIRECT (status 301/302/307/308), honour it immediately
  //   — this is a locale normalisation redirect (e.g. / → /vi).
  // • If it returns a REWRITE (status 200) we MUST NOT return early because
  //   our custom app logic (JWT check, x-pathname header, etc.) still needs
  //   to execute. Instead, we forward the intl headers into our own response.
  const intlResponse = intlMiddleware(request)
  const intlStatus = intlResponse?.status ?? 200
  if (intlStatus === 301 || intlStatus === 302 || intlStatus === 307 || intlStatus === 308) {
    return intlResponse
  }

  // ── Custom app logic ────────────────────────────────────────────────────
  // Merge any rewrite headers set by intl middleware (e.g. x-next-intl-locale)
  // into our own request headers so downstream code can read the locale.
  const requestHeaders = new Headers(request.headers)
  intlResponse?.headers.forEach((value, key) => {
    requestHeaders.set(key, value)
  })
  requestHeaders.set('x-pathname', pathname + request.nextUrl.search)

  // ── Stateless auth redirect for login/signup pages ─────────────────────
  // If the user already has a valid JWT, redirect them away from auth pages.
  // Uses jose.jwtVerify() at the Edge — zero network calls, zero DB queries.
  // Use endsWith so both /signin and /vi/signin (locale-prefixed) are matched
  const isAuthPage = pathname === '/signup' || pathname === '/signin'
    || pathname.endsWith('/signup') || pathname.endsWith('/signin')

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
     * Match all request paths EXCEPT the ones that must be ignored:
     *
     * Ignored paths (next-intl + middleware must NOT process these):
     *   - /api/(.*)         — Payload & Next.js API routes
     *   - /admin/(.*)       — Payload CMS legacy admin (if any)
     *   - /dashboard/(.*)   — Payload CMS Admin Panel (handled by Dashboard guard above)
     *   - /_next/(.*)       — Next.js compiled assets & internals
     *   - /favicon.ico      — Browser favicon
     *   - Any path ending in a static file extension
     *
     * NOTE: /dashboard/* is still matched so the Payload Dashboard guard
     * (step 2 above) can intercept /dashboard/login → /signin. The guard
     * exits immediately for all other /dashboard/* paths, so Payload internals
     * are never affected by locale logic.
     *
     * The two-pattern approach is the officially recommended next-intl
     * pattern: the first catches root "/", the second catches all
     * non-excluded sub-paths.
     */
    '/',
    '/((?!api|admin|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot|css|js|map)$).*)',
  ],
}
