import { atomicClaim, nextFailureStatus } from '@/services/email/claimMailLog'
import config from '@payload-config'
import { Receiver } from '@upstash/qstash'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

/**
 * POST /api/email/worker
 *
 * Called by QStash after an email job is enqueued.
 * Verifies the QStash signature, atomically claims the mail-log record,
 * sends the email via Payload's email adapter, and updates the log status.
 */
export async function POST(req: NextRequest) {
  // 1. Verify the request came from QStash
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || '',
  })

  const body = await req.text()
  const isValid = await receiver
    .verify({
      signature: req.headers.get('upstash-signature') || '',
      body,
    })
    .catch(() => false)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid QStash signature' }, { status: 401 })
  }

  // 2. Parse the job payload
  const { mailLogId } = JSON.parse(body) as { mailLogId: number }

  if (!mailLogId) {
    return NextResponse.json({ error: 'Missing mailLogId in request body' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  // 3. Fetch the mail-log record
  const log = await payload.findByID({
    collection: 'mail-logs',
    id: mailLogId,
    overrideAccess: true,
  })

  if (!log) {
    return NextResponse.json({ error: `mail-log ${mailLogId} not found` }, { status: 404 })
  }

  // 4. Quick guard: skip terminal states (no atomic claim needed)
  if (log.status === 'sent') {
    return NextResponse.json({ message: `Already sent, skipping.` })
  }

  // 5. Atomically claim the record — single SQL UPDATE...RETURNING
  //    If another process (duplicate QStash delivery or cron) already grabbed it, skip.
  const claimed = await atomicClaim(payload, mailLogId, ['pending', 'failed'])
  if (!claimed) {
    return NextResponse.json({ message: 'Log already claimed by another process.' })
  }

  // 6. Send the email via Payload's configured adapter (Resend)
  try {
    await payload.sendEmail({
      to: log.to,
      subject: log.subject,
      html: log.html,
    })

    // Success — mark as sent
    await payload.update({
      collection: 'mail-logs',
      id: mailLogId,
      overrideAccess: true,
      data: {
        status: 'sent',
        sentAt: new Date().toISOString(),
        lastError: null,
      },
    })

    console.log(`[Email Worker] Sent mail-log ${mailLogId} to ${log.to}`)
    return NextResponse.json({ success: true, mailLogId })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const newStatus = nextFailureStatus(log.retryCount || 0)
    const newRetryCount = (log.retryCount || 0) + 1

    console.error(
      `[Email Worker] Failed mail-log ${mailLogId} (attempt ${newRetryCount}):`,
      errorMessage,
    )

    await payload.update({
      collection: 'mail-logs',
      id: mailLogId,
      overrideAccess: true,
      data: {
        status: newStatus,
        retryCount: newRetryCount,
        lastError: errorMessage,
      },
    })

    if (newStatus === 'dead-letter') {
      // Return 200 — stops QStash from retrying a permanently failed log
      console.error(
        `[Email Worker] Dead letter: mail-log ${mailLogId} — manual intervention required`,
      )
      return NextResponse.json({ error: errorMessage, deadLetter: true })
    }

    // Return 500 → QStash will auto-retry with backoff
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
