import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

const TIMEOUT_MS = 5000

function withTimeout<T>(promise: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms)),
  ])
}

export async function GET() {
  // Run all checks independently — one failure doesn't hide others
  const [dbResult, qstashResult, resendResult] = await Promise.allSettled([
    // 1. Database (Neon) — light read against mail-logs
    withTimeout(
      getPayload({ config }).then((payload) =>
        payload.find({
          collection: 'mail-logs',
          limit: 1,
          overrideAccess: true,
        }),
      ),
    ),

    // 2. QStash — verify token via the schedules endpoint
    withTimeout(
      fetch('https://qstash.upstash.io/v2/schedules', {
        headers: { Authorization: `Bearer ${process.env.QSTASH_TOKEN}` },
      }),
    ),

    // 3. Resend — verify API key via domains endpoint
    //    200 = connected & valid key  |  401 = connected, invalid key  |  5xx = Resend is down
    withTimeout(
      fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      }),
    ),
  ])

  const isReachable = (result: PromiseSettledResult<Response>) =>
    result.status === 'fulfilled' && result.value.status < 500

  return NextResponse.json({
    database: dbResult.status === 'fulfilled' ? '✅' : '❌',
    qstash: isReachable(qstashResult as PromiseSettledResult<Response>) ? '✅' : '❌',
    resend: isReachable(resendResult as PromiseSettledResult<Response>) ? '✅' : '❌',
    timestamp: new Date().toISOString(),
  })
}
