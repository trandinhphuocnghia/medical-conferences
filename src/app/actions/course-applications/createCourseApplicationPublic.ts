'use server'

import configPromise from '@payload-config'
import { ValidationError } from 'payload'
import { getPayload } from 'payload'

import type { ApplicationFormValues } from '@/components/CourseApplication/schema'

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */

export type CourseApplicationPayload = ApplicationFormValues & {
  /** Payload course document ID */
  course: number
  /** Honeypot field — must be empty on legitimate submissions */
  _hp: string
  /** Mount timestamp (ms since epoch) — used for bot speed check */
  _t: number
}

export type CourseApplicationResult =
  | { success: true }
  | { success: false; error: string }

/* ─────────────────────────────────────────────────────────────────────────────
 * createCourseApplicationPublic
 *
 * Security order:
 *   1. Timestamp check  — rejects bot submissions faster than 3 seconds
 *   2. Honeypot check   — rejects bots that fill hidden form fields
 *   3. Rate limit       — 10 requests / 1 hour per IP (Upstash Redis)
 *   4. payload.create   — writes to the course-applications collection
 * ──────────────────────────────────────────────────────────────────────────── */
export async function createCourseApplicationPublic(
  data: CourseApplicationPayload,
): Promise<CourseApplicationResult> {
  const { _hp, _t, course, ...formValues } = data

  // ── 1. Timestamp check ────────────────────────────────────────────────────
  // Legitimate humans take at least 3 seconds to fill in a form.
  // Bots that submit immediately are silently accepted (no error shown).
  if (Date.now() - _t < 3000) {
    return { success: true }
  }

  // ── 2. Honeypot check ─────────────────────────────────────────────────────
  // The _hp field is visually hidden; only bots that auto-fill all inputs
  // will populate it. Silent accept — same UX as the timestamp check.
  if (_hp && _hp.length > 0) {
    return { success: true }
  }

  // ── 3. Rate limiting ──────────────────────────────────────────────────────
  const { headers: getHeaders } = await import('next/headers')
  const { courseApplicationLimiter } = await import('@/server/rateLimit')

  if (courseApplicationLimiter) {
    const headersList = await getHeaders()

    // IP extraction: follow Cloudflare → Nginx/Vercel → standard proxy → fallback
    const ip =
      headersList.get('cf-connecting-ip') ??
      headersList.get('x-real-ip') ??
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      '127.0.0.1'

    try {
      const { success, reset } = await courseApplicationLimiter.limit(`course-application:${ip}`)

      if (!success) {
        const minutesLeft = Math.ceil((reset - Date.now()) / 1000 / 60)
        return {
          success: false,
          error: `Too many requests. Please try again after ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
        }
      }
    } catch (error) {
      console.error('[CourseApplication] Rate-limit service unavailable:', error)
      return {
        success: false,
        error: 'Service temporarily unavailable. Please try again later.',
      }
    }
  }

  // ── 4. Payload create ─────────────────────────────────────────────────────
  try {
    const payload = await getPayload({ config: configPromise })

    // Build a concrete, non-union data object so Payload's overloaded
    // create() types resolve correctly (spreading a discriminated union
    // directly causes TS2345 from the Payload generic overloads).
    const {
      first_name,
      last_name,
      date_of_birth,
      email,
      phone,
      has_organization,
      organization,
      enrollment_type,
    } = formValues

    const commonFields = {
      first_name,
      last_name,
      date_of_birth,
      email,
      phone,
      has_organization,
      organization: organization ?? undefined,
      enrollment_type,
      course,
    }

    const enrollmentFields =
      enrollment_type === 'short_course'
        ? {
            preferred_duration:   (formValues as Extract<typeof formValues, { enrollment_type: 'short_course' }>).preferred_duration   ?? undefined,
            preferred_content:    (formValues as Extract<typeof formValues, { enrollment_type: 'short_course' }>).preferred_content    ?? undefined,
            preferred_start_date: (formValues as Extract<typeof formValues, { enrollment_type: 'short_course' }>).preferred_start_date ?? undefined,
            preferred_end_date:   (formValues as Extract<typeof formValues, { enrollment_type: 'short_course' }>).preferred_end_date   ?? undefined,
          }
        : {
            academic_level:       (formValues as Extract<typeof formValues, { enrollment_type: 'postgraduate' }>).academic_level,
            entrance_exam_passed: (formValues as Extract<typeof formValues, { enrollment_type: 'postgraduate' }>).entrance_exam_passed ?? false,
            research_start_month: (formValues as Extract<typeof formValues, { enrollment_type: 'postgraduate' }>).research_start_month ?? undefined,
            research_end_month:   (formValues as Extract<typeof formValues, { enrollment_type: 'postgraduate' }>).research_end_month   ?? undefined,
          }

    // Sanitize: HTML inputs send "" for empty optional fields (e.g. date pickers
    // left blank). PostgreSQL timestamp columns reject "", so convert to undefined
    // which Payload maps to NULL. Required fields are already validated by Zod
    // before reaching this point and will never be empty strings here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitize = (obj: Record<string, any>) =>
      Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, value === '' ? undefined : value]),
      )

    await payload.create({
      collection: 'course-applications',
      overrideAccess: true, // public submission — bypass access control
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: sanitize({ ...commonFields, ...enrollmentFields }) as any,
    })

    return { success: true }
  } catch (error) {
    // Duplicate-application guard throws a Payload ValidationError with a
    // user-readable message — surface it directly to the form.
    if (error instanceof ValidationError) {
      return { success: false, error: error.message }
    }

    console.error('[createCourseApplicationPublic] Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
