import { Client } from '@upstash/qstash'

/**
 * Singleton QStash client.
 *
 * Required env vars:
 *   QSTASH_TOKEN   – from upstash.com/qstash console
 */
let _client: Client | null = null

export function getQStashClient(): Client {
  if (!_client) {
    if (!process.env.QSTASH_TOKEN) {
      throw new Error('QSTASH_TOKEN is not set. Email queueing will not work.')
    }
    _client = new Client({ token: process.env.QSTASH_TOKEN })
  }
  return _client
}

/**
 * Publishes an email job to QStash.
 * The worker at /api/email/worker will be triggered to process it.
 *
 * @param mailLogId - The ID of the mail-log record to process
 */
export async function enqueueEmailJob(mailLogId: number): Promise<void> {
  const client = getQStashClient()
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (!baseUrl) throw new Error('NEXT_PUBLIC_SERVER_URL is not set.')

  await client.publishJSON({
    url: `${baseUrl}/api/email/worker`,
    body: { mailLogId },
    retries: 3,
  })
}

export interface NotificationEmailPayload {
  to: string
  cc?: string
  subject: string
  html: string
}

/**
 * Publishes a direct notification email job to QStash.
 * The endpoint at /api/email/notify will be triggered (fire and forget, no mail-log, retries: 0).
 */
export async function enqueueNotificationJob(payload: NotificationEmailPayload): Promise<void> {
  const client = getQStashClient()
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (!baseUrl) throw new Error('NEXT_PUBLIC_SERVER_URL is not set.')

  await client.publishJSON({
    url: `${baseUrl}/api/email/notify`,
    body: payload,
    retries: 0,
  })
}
