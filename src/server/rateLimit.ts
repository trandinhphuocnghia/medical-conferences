import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Shared Redis client (one connection for all limiters) ─────────────────────
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null

// ── Rate limiters ─────────────────────────────────────────────────────────────

/** Abstract & Registration submissions: 3 requests per 1 hour per IP */
export const submissionLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'ratelimit:submission',
    })
  : null

/** File uploads (UploadThing): 3 uploads per 1 minute per IP */
export const uploadLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 m'),
      analytics: true,
      prefix: 'ratelimit:upload',
    })
  : null

/** Course application submissions: 10 requests per 1 hour per IP */
export const courseApplicationLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      analytics: true,
      prefix: 'ratelimit:course-application',
    })
  : null
