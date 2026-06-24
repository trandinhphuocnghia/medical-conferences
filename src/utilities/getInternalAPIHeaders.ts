/**
 * [EXPERIMENTAL] Internal API headers for server-to-server fetch calls.
 *
 * When the development Basic Auth middleware is active (APP_ENV=development),
 * internal fetch calls from SSR / ISR revalidation are also intercepted and
 * rejected with 401. This utility appends the same credentials so that
 * server-to-server calls pass through the middleware gate.
 *
 * This is a targeted workaround. If the Basic Auth middleware is removed or
 * the infrastructure changes (e.g. middleware matcher excludes /api), this
 * entire file can be safely deleted — nothing else depends on it beyond the
 * explicit import sites.
 */

export function getInternalAPIHeaders(): HeadersInit {
  if (
    process.env.APP_ENV === 'development' &&
    process.env.DEV_USER &&
    process.env.DEV_PASSWORD
  ) {
    const credentials = Buffer.from(
      `${process.env.DEV_USER}:${process.env.DEV_PASSWORD}`,
    ).toString('base64')

    return {
      Authorization: `Basic ${credentials}`,
    }
  }

  // Non-development environments — no extra headers needed
  return {}
}
