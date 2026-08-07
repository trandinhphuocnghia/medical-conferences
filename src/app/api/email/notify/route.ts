import config from '@payload-config'
import { Receiver } from '@upstash/qstash'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

/**
 * POST /api/email/notify
 *
 * Dedicated endpoint for fire-and-forget team notifications via QStash.
 * Verifies QStash signature, calls payload.sendEmail directly without creating
 * a mail-log record or performing retries.
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

  // 2. Parse direct notification payload
  const { to, cc, subject, html } = JSON.parse(body) as {
    to?: string
    cc?: string
    subject?: string
    html?: string
  }

  if (!to || !subject || !html) {
    return NextResponse.json(
      { error: 'Missing required parameters (to, subject, html)' },
      { status: 400 },
    )
  }

  // 3. Send email directly via Payload email adapter
  try {
    const payload = await getPayload({ config })

    await payload.sendEmail({
      to,
      ...(cc ? { cc } : {}),
      subject,
      html,
    })

    console.log(`[Email Notify] Sent direct notification to ${to}${cc ? ` (CC: ${cc})` : ''}`)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.warn('[Email Notify] Direct notification failed:', errorMessage)
    // Return 200 to ensure QStash does not retry fire-and-forget notifications
    return NextResponse.json({ error: errorMessage }, { status: 200 })
  }
}
