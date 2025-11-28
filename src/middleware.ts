import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect default Payload login to custom signin page
  if (pathname === '/dashboard/login') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Get the payload-token cookie
  const token = request.cookies.get('payload-token')?.value

  // If there's a token, check the user's auth status
  if (token) {
    try {
      // Use environment variable for production, fallback to origin for local
      const baseUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || request.nextUrl.origin

      const response = await fetch(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
        // Add timeout and cache options for production
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (response.ok) {
        const { user } = await response.json()

        // If user is authenticated and on signup/login pages, redirect to dashboard
        if (user && (pathname === '/signup' || pathname === '/signin')) {
          if (user.role === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }
          return NextResponse.redirect(
            new URL('/dashboard/account', request.url),
          )
        }
      }
    } catch (error) {
      // If there's an error checking auth, continue to the page
      console.error('Middleware auth check error:', error)
    }
  }

  return NextResponse.next()
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
