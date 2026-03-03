import { sql } from 'drizzle-orm'
import type { BasePayload } from 'payload'

/** Maximum delivery attempts before a log is moved to dead-letter. */
export const MAX_RETRIES = 3

/**
 * Atomically claim a mail-log record for processing.
 *
 * Performs a single SQL round-trip:
 *   UPDATE mail_logs SET status = 'processing'
 *   WHERE id = $id AND status IN (...acceptableStatuses)
 *   RETURNING id
 *
 * If another process (QStash worker or cron) already claimed the record,
 * the UPDATE returns 0 rows and this function returns false → caller must skip.
 *
 * This eliminates the TOCTOU race of "fetch → check → update" patterns.
 */
export async function atomicClaim(
  payload: BasePayload,
  id: number,
  fromStatuses: ('pending' | 'failed')[],
): Promise<boolean> {
  // Access the raw Drizzle instance from Payload's postgres adapter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (payload.db as any).drizzle

  // Values are hardcoded constants (not user input) — sql.raw is safe here
  const statusClause = fromStatuses.map((s) => `'${s}'`).join(', ')

  const result = await db.execute(
    sql`UPDATE mail_logs
        SET status = 'processing', updated_at = NOW()
        WHERE id = ${id} AND status IN (${sql.raw(statusClause)})
        RETURNING id`,
  )

  // node-postgres returns { rows: [...] }; handle both array and object shapes
  const rowCount = result.rows?.length ?? result?.length ?? 0
  return rowCount > 0
}

/**
 * Determines the next failure status based on the current retry count.
 * Once MAX_RETRIES is reached, the log becomes a dead-letter (no further retries).
 */
export function nextFailureStatus(currentRetryCount: number): 'failed' | 'dead-letter' {
  const newCount = (currentRetryCount || 0) + 1
  return newCount >= MAX_RETRIES ? 'dead-letter' : 'failed'
}
