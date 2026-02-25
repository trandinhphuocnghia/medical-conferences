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

  console.log('[Email Cron] Starting email processing job')

  // 3. Fetch pending/failed logs
  const logs = await payload.find({
    collection: 'mail-logs',
    overrideAccess: true,
    where: {
      or: [
        { status: { equals: 'pending' } },
        {
          and: [{ status: { equals: 'failed' } }, { retryCount: { less_than: 3 } }],
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
