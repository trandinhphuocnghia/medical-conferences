import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

export async function GET(req: NextRequest) {
  // 1. Quick auth check first (before expensive getPayload call)
  const authHeader = req.headers.get('authorization')
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`

  // Early exit for unauthorized requests
  if (!isCron) {
    // For non-cron requests, we need to check admin role
    // This requires payload, but we'll do it efficiently
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    if (user?.role !== 'admin') {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  // 2. Initialize payload (reuse if already initialized for auth)
  const payload = await getPayload({ config })

  const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE || '10', 10)
  const staleThresholdMs = 10 * 60 * 1000 // 10 minutes

  console.log('[Email Cron] Starting sweep (QStash fallback)')

  // 3a. Recover stale 'processing' records — these are logs that QStash triggered
  //     but the worker crashed before updating the status. Reset them to 'failed'
  //     so this sweep can pick them up.
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

  for (const stale of staleProcessing.docs) {
    await payload.update({
      collection: 'mail-logs',
      id: stale.id,
      overrideAccess: true,
      data: { status: 'failed', lastError: 'Stale processing — recovered by cron' },
    })
    console.log(`[Email Cron] Reset stale processing log ${stale.id}`)
  }

  // 3b. Fetch pending/failed logs QStash may have missed
  // Grace period: skip logs newer than 2 minutes — QStash is handling those.
  const gracePeriodMs = 2 * 60 * 1000
  const graceThreshold = new Date(Date.now() - gracePeriodMs).toISOString()

  const logs = await payload.find({
    collection: 'mail-logs',
    overrideAccess: true,
    where: {
      and: [
        { createdAt: { less_than: graceThreshold } },
        {
          or: [
            { status: { equals: 'pending' } },
            {
              and: [{ status: { equals: 'failed' } }, { retryCount: { less_than: 3 } }],
            },
          ],
        },
      ],
    },
    limit: batchSize,
  })

  console.log(`[Email Cron] Found ${logs.totalDocs} logs to process`)

  const results = {
    total: logs.totalDocs,
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [] as { id: string; error: string }[], // Added to store error details
  }

  // 4. Process each log with race condition prevention
  for (const log of logs.docs) {
    // Re-fetch to ensure status hasn't changed (race condition check)
    const currentLog = await payload.findByID({
      collection: 'mail-logs',
      id: log.id,
      depth: 0,
      overrideAccess: true,
      select: {
        status: true,
      },
    })

    // Skip if already sent or processing
    if (currentLog.status === 'sent' || currentLog.status === 'processing') {
      results.skipped++
      continue
    }

    results.processed++

    // Mark as processing to prevent concurrent execution
    await payload.update({
      collection: 'mail-logs',
      id: log.id,
      overrideAccess: true,
      data: { status: 'processing' },
    })

    try {
      await payload.sendEmail({
        to: log.to,
        subject: log.subject,
        html: log.html,
      })

      // Success: Update status to sent with timestamp
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
      // Failure: Update status to failed and increment retry count
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[Email Cron] Failed to send log ${log.id}:`, errorMessage)

      await payload.update({
        collection: 'mail-logs',
        id: log.id,
        overrideAccess: true,
        data: {
          status: 'failed',
          retryCount: (log.retryCount || 0) + 1,
          lastError: errorMessage,
        },
      })
      results.failed++
    }
  }

  console.log('[Email Cron] Results:', results)

  return NextResponse.json(results)
}
