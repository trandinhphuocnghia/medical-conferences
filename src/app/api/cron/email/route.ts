import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { atomicClaim, MAX_RETRIES, nextFailureStatus } from '@/services/email/claimMailLog'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  // 1. Auth check — Bearer CRON_SECRET (Railway cron) or admin user session
  const authHeader = req.headers.get('authorization')
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isCron) {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    if (user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  const payload = await getPayload({ config })
  const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE || '10', 10)
  const staleThresholdMs = 10 * 60 * 1000 // 10 minutes

  console.log('[Email Cron] Starting sweep (QStash fallback)')

  // 2. Recover stale 'processing' records — crashed workers that never updated status.
  //    Reset to 'failed' so the sweep can pick them up.
  const staleProcessing = await payload.find({
    collection: 'mail-logs',
    overrideAccess: true,
    where: {
      and: [
        { status: { equals: 'processing' } },
        { updatedAt: { less_than: new Date(Date.now() - staleThresholdMs).toISOString() } },
      ],
    },
    limit: batchSize,
  })

  await Promise.all(
    staleProcessing.docs.map(async (stale) => {
      await payload.update({
        collection: 'mail-logs',
        id: stale.id,
        overrideAccess: true,
        data: { status: 'failed', lastError: 'Stale processing — recovered by cron' },
      })
      console.log(`[Email Cron] Reset stale processing log ${stale.id}`)
    }),
  )

  // 3. Fetch pending/failed logs that QStash may have missed.
  //    Grace period: skip logs newer than 2 min — QStash is still handling those.
  //const graceThreshold = new Date(Date.now() - 2 * 60 * 1000).toISOString()

  const logs = await payload.find({
    collection: 'mail-logs',
    overrideAccess: true,
    where: {
      or: [
        { status: { equals: 'pending' } },
        {
          or: [
            { status: { equals: 'pending' } },
            {
              and: [{ status: { equals: 'failed' } }, { retryCount: { less_than: MAX_RETRIES } }],
            },
          ],
        },
      ],
    },
    limit: batchSize,
  })

  console.log(`[Email Cron] Found ${logs.totalDocs} logs to sweep`)

  const results = {
    total: logs.totalDocs,
    processed: 0,
    succeeded: 0,
    failed: 0,
    deadLettered: 0,
    skipped: 0,
  }

  // 4. Process each log with ATOMIC claim.
  //    Single SQL: UPDATE mail_logs SET status='processing' WHERE id=X AND status IN ('pending','failed') RETURNING id
  //    If another process already claimed it → 0 rows → skip (no race condition).
  for (const log of logs.docs) {
    const claimed = await atomicClaim(payload, log.id, ['pending', 'failed'])

    if (!claimed) {
      results.skipped++
      continue
    }

    results.processed++

    try {
      await payload.sendEmail({
        to: log.to,
        subject: log.subject,
        html: log.html,
      })

      await payload.update({
        collection: 'mail-logs',
        id: log.id,
        overrideAccess: true,
        data: {
          status: 'sent',
          sentAt: new Date().toISOString(),
          lastError: null,
        },
      })

      results.succeeded++
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const newStatus = nextFailureStatus(log.retryCount || 0)
      const newRetryCount = (log.retryCount || 0) + 1

      console.error(`[Email Cron] Failed log ${log.id} (attempt ${newRetryCount}):`, errorMessage)

      await payload.update({
        collection: 'mail-logs',
        id: log.id,
        overrideAccess: true,
        data: { status: newStatus, retryCount: newRetryCount, lastError: errorMessage },
      })

      if (newStatus === 'dead-letter') {
        console.error(`[Email Cron] 💀 Dead letter: mail-log ${log.id} — manual review required`)
        results.deadLettered++
      } else {
        results.failed++
      }
    }
  }

  console.log('[Email Cron] Results:', results)
  return NextResponse.json(results)
}
