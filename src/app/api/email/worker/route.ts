import config from '@payload-config'
import { Receiver } from '@upstash/qstash'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

/**
 * POST /api/email/worker
 *
 * Called by QStash after an email job is enqueued.
 * Verifies the QStash signature, fetches the mail-log record,
 * sends the email via Payload's email adapter, and updates the log status.
 *
 * Required env vars:
 *   QSTASH_CURRENT_SIGNING_KEY
 *   QSTASH_NEXT_SIGNING_KEY
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

  // Skip if already sent (idempotency guard — QStash delivers at-least-once)
  if (log.status === 'sent') {
    return NextResponse.json({ message: 'Already sent, skipping.' })
  }

  // 4. Mark as processing to prevent duplicate sends
  await payload.update({
    collection: 'mail-logs',
    id: mailLogId,
    overrideAccess: true,
    data: { status: 'processing' },
  })

  // 5. Send the email via Payload's configured adapter (Resend)
  try {
    await payload.sendEmail({
      to: log.to,
      subject: log.subject,
      html: log.html,
    })

    // 6. Success — mark as sent
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
    console.error(`[Email Worker] Failed to send mail-log ${mailLogId}:`, errorMessage)

    // 7. Failure — update status and let QStash retry
    await payload.update({
      collection: 'mail-logs',
      id: mailLogId,
      overrideAccess: true,
      data: {
        status: 'failed',
        retryCount: (log.retryCount || 0) + 1,
        lastError: errorMessage,
      },
    })

    // Return 500 so QStash knows to retry
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
