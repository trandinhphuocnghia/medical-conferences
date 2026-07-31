import type { CourseApplication, Course } from '@/payload-types'
import { courseApplicationConfirmationMail } from '@/services/email/mail-templates/course-application-confirmation'
import { enqueueEmailJob } from '@/services/email/qstash'
import { CollectionAfterChangeHook } from 'payload'

/* ─────────────────────────────────────────────────────────────────────────────
 * sendCourseApplicationConfirmation
 *
 * afterChange hook — triggers on `create` only.
 *
 * Flow:
 *   1. Bail out if not a create operation.
 *   2. Fetch the related course title (depth 0, English locale).
 *   3. Build the confirmation email HTML.
 *   4. Write a 'pending' mail-log record for audit trail + cron fallback.
 *   5. Enqueue the job to QStash → triggers /api/email/worker.
 *
 * Email failure must NOT block the form submission — all errors are caught
 * and logged; nothing is re-thrown.
 * ──────────────────────────────────────────────────────────────────────────── */
export const sendCourseApplicationConfirmation: CollectionAfterChangeHook<CourseApplication> =
  async ({ data, doc, operation, req }) => {
    // ── 1. Only trigger on new submissions ──────────────────────────────────
    if (operation !== 'create') return data

    try {
      // ── 2. Resolve the course title ────────────────────────────────────────
      // `doc.course` may be a populated Course object (depth > 0) or a bare ID.
      let courseTitle = 'the course'

      if (typeof doc.course === 'object' && doc.course !== null) {
        courseTitle = (doc.course as Course).title ?? courseTitle
      } else if (typeof doc.course === 'number') {
        const course = await req.payload.findByID({
          collection: 'courses',
          id: doc.course,
          locale: 'en',
          depth: 0,
        })
        courseTitle = course?.title ?? courseTitle
      }

      // ── 3. Build the email ─────────────────────────────────────────────────
      const subject = `Course Application Received — ${courseTitle}`
      const html = courseApplicationConfirmationMail(doc, courseTitle)

      // ── 4. Create the mail-log record (audit trail + cron fallback) ────────
      const mailLog = await req.payload.create({
        collection: 'mail-logs',
        overrideAccess: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: {
          to: doc.email,
          subject,
          html,
          status: 'pending',
          retryCount: 0,
          source: 'course-application',
          courseApplicationId: doc.id,
        } as any,
        req,
      })

      // ── 5. Enqueue to QStash — fires /api/email/worker ────────────────────
      try {
        await enqueueEmailJob(mailLog.id)
      } catch (err) {
        // Log the QStash failure but do NOT throw — the mail-log exists and
        // will be picked up by the fallback /api/cron/email sweep.
        req.payload.logger.error(
          { err, mailLogId: mailLog.id },
          '[sendCourseApplicationConfirmation] Failed to enqueue QStash job. Mail-log preserved for cron fallback.',
        )
      }
    } catch (err) {
      // Outer catch: any unexpected error (DB write, template render, etc.)
      // must NOT propagate — email failure must never block form submission.
      req.payload.logger.error(
        { err, applicationId: doc.id, email: doc.email },
        '[sendCourseApplicationConfirmation] Unexpected error. Confirmation email was not sent.',
      )
    }

    return data
  }
