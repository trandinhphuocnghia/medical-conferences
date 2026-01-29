import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

export async function GET(req: NextRequest) {
  // 1. Security Check
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = await getPayload({ config })

  // 2. Fetch pending logs and failed logs with retry count < 3
  const logs = await payload.find({
    collection: 'mail-logs',
    where: {
      or: [
        { status: { equals: 'pending' } },
        {
          and: [{ status: { equals: 'failed' } }, { retryCount: { less_than: 3 } }],
        },
      ],
    },
    limit: 20, // Batch size
  })

  const results = {
    total: logs.totalDocs,
    processed: 0,
    succeeded: 0,
    failed: 0,
  }

  // 3. Process each log
  for (const log of logs.docs) {
    results.processed++

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

      await payload.update({
        collection: 'mail-logs',
        id: log.id,
        data: {
          status: 'failed',
          retryCount: (log.retryCount || 0) + 1,
          lastError: errorMessage,
        },
      })
      results.failed++
    }
  }

  return NextResponse.json(results)
}
