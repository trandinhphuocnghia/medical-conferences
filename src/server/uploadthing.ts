import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { uploadLimiter } from './rateLimit'

const f = createUploadthing()

// ── File Router ───────────────────────────────────────────────────────────────
export const publicFileRouter = {
  /**
   * abstractFileUploader
   *
   * Used by the abstract submission form for client-side, direct-to-cloud uploads.
   * Security layers applied:
   *   1. IP-based rate limiting via Upstash Redis (3 uploads / 1 min)
   *   2. [TODO] Cloudflare Turnstile token validation
   */
  abstractFileUploader: f({
    pdf: { maxFileSize: '8MB', maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      // ── 1. Extract client IP ────────────────────────────────────────────────
      const ip =
        req.headers.get('cf-connecting-ip') ?? // Cloudflare
        req.headers.get('x-real-ip') ?? // Nginx / Vercel
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        '127.0.0.1'

      // ── 2. [TODO] Cloudflare Turnstile validation ───────────────────────────
      // const turnstileToken = req.headers.get('x-turnstile-token')
      // await validateTurnstileToken(turnstileToken)

      // ── 3. Rate limiting ────────────────────────────────────────────────────
      if (uploadLimiter) {
        const { success, remaining, reset } = await uploadLimiter.limit(ip)

        if (!success) {
          const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000)
          throw new UploadThingError(
            `Rate limit exceeded. You can upload again in ${retryAfterSeconds}s. (${remaining} remaining)`,
          )
        }
      }

      // ── 4. Pass metadata to onUploadComplete ────────────────────────────────
      return { ip }
    })
    .onUploadComplete(async ({ file }) => {
      // This runs on YOUR server after the browser finishes uploading directly
      // to UploadThing. We use Payload's local API (not an HTTP fetch) so this
      // works in both local dev and production — no need for PAYLOAD_API_KEY
      // and no dependency on a publicly reachable server URL.
      console.log('[UploadThing] onUploadComplete fired for file:', file.name, file.key)

      try {
        // Lazy-import to avoid circular dependency issues at module init time
        const { getPayload } = await import('payload')
        const configPromise = (await import('@payload-config')).default

        const payload = await getPayload({ config: configPromise })

        const record = await payload.create({
          collection: 'public-files',
          data: {
            url: file.url,
            key: file.key,
            filename: file.name,
            mimeType: file.type,
            filesize: file.size,
          },
          // Skip access control — this runs server-side with full trust
          overrideAccess: true,
        })

        console.log('[UploadThing] Created public-files record, id:', record.id)

        // Return the new public-files doc ID to the client so the form can
        // link the file to the abstract on submission.
        return { success: true, publicFileId: record.id }
      } catch (err) {
        console.error('[UploadThing] onUploadComplete error:', err)
        return { success: false }
      }
    }),
} satisfies FileRouter

export type PublicFileRouter = typeof publicFileRouter
