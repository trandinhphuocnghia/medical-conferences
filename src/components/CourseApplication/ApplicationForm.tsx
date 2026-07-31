'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState, useTransition } from 'react'
import { useForm, type Path } from 'react-hook-form'

import { createCourseApplicationPublic } from '@/app/actions/course-applications/createCourseApplicationPublic'
import { Spinner } from '@/components/ui/spinner'
import { toastError } from '@/utilities/toast'
import {
  createApplicationFormSchema,
  STEP_1_FIELDS,
  type ApplicationFormValues,
} from './schema'
import { ProgressTracker } from './ProgressTracker'
import { StepPersonalInfo } from './StepPersonalInfo'
import { StepCourseDetails } from './StepCourseDetails'

/* ─────────────────────────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────────────────────────── */
const TOTAL_STEPS = 2

/* ─────────────────────────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────────────────────────── */
const DRAFT_STORAGE_KEY = 'courseApplicationDraft'

/* ─────────────────────────────────────────────────────────────────────────────
 * Props
 * ──────────────────────────────────────────────────────────────────────────── */
interface ApplicationFormProps {
  /** Payload document ID for the course being applied to.
   *  Required — the page-level guard (course_type === 'on_demand' && active)
   *  ensures this is always a valid Payload document ID before rendering.
   */
  courseId: number
  /** Human-readable course title — displayed in the form heading. */
  courseTitle?: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * ApplicationForm
 * ──────────────────────────────────────────────────────────────────────────── */
export function ApplicationForm({ courseId, courseTitle }: ApplicationFormProps) {
  const t = useTranslations('CourseApplication')
  const locale = useLocale()
  const router = useRouter()

  // ── Pending state (useTransition for server action) ────────────────────────
  const [isPending, startTransition] = useTransition()

  // ── Step state ─────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1)

  // ── Scroll anchor — smooth-scrolls to the top of the card on step change ──
  const formContainerRef = useRef<HTMLDivElement>(null)

  // ── Security: mount timestamp for bot speed check ─────────────────────────
  // Captured once at component mount — submitted alongside form data.
  const mountTime = useRef<number>(Date.now())

  // ── Security: honeypot ref (uncontrolled — keeps it out of RHF state) ─────
  const honeypotRef = useRef<HTMLInputElement>(null)

  // ── Build schema with translated messages ─────────────────────────────────
  // Rebuilt whenever `t` changes (i.e. on locale switch) so error messages
  // always reflect the currently active language.
  const schema = useMemo(() => createApplicationFormSchema(t), [t])

  // ── react-hook-form ────────────────────────────────────────────────────────
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      enrollment_type: 'short_course',
      has_organization: false,
    },
    mode: 'onTouched',
  })

  // ── Step metadata (drives ProgressTracker labels) ──────────────────────────
  const steps = [
    { label: t('steps.personalInfo') },
    { label: t('steps.enrollmentDetails') },
  ]

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (currentStep === 1) {
      // Cast to the precise path union that trigger() expects.
      const step1Fields = STEP_1_FIELDS as Path<ApplicationFormValues>[]
      const isValid = await form.trigger(step1Fields)
      if (!isValid) return
    }
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, TOTAL_STEPS)
      // Defer scroll until after React commits the new step's DOM
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
      return next
    })
  }

  const handleBack = () => {
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 1)
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
      return next
    })
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = (values: ApplicationFormValues) => {
    startTransition(async () => {
      const result = await createCourseApplicationPublic({
        ...values,
        course: courseId,
        _hp: honeypotRef.current?.value ?? '',
        _t: mountTime.current,
      })

      if (result.success) {
        // Clear any persisted draft from sessionStorage
        try {
          sessionStorage.removeItem(DRAFT_STORAGE_KEY)
        } catch {
          // sessionStorage may be unavailable (private browsing, etc.) — ignore
        }

        // Redirect to locale-aware thank-you page
        router.push(`/${locale}/courses/thank-you`)
      } else {
        toastError({ message: result.error })
      }
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={formContainerRef}
      className="mx-auto max-w-[640px] min-h-[500px] bg-card rounded-2xl shadow-md border border-border p-6 md:p-10"
    >
      {/* Title */}
      <h1 className="text-clinical mb-2 text-2xl">{t('title')}</h1>
      {courseTitle && (
        <p className="text-muted-foreground text-sm mb-4">{courseTitle}</p>
      )}

      {/* Step progress tracker */}
      <ProgressTracker currentStep={currentStep} totalSteps={TOTAL_STEPS} steps={steps} />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

        {/* ── Honeypot — visually hidden, aria-hidden, no tabstop ── */}
        {/*    Bots auto-fill all inputs; humans never see or touch this field. */}
        <input
          ref={honeypotRef}
          name="_hp"
          type="text"
          className="absolute -left-[9999px] -top-[9999px]"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* ── Step 1: Personal Information ── */}
        {currentStep === 1 && (
          <section aria-labelledby="step1-heading">
            <h2 id="step1-heading" className="text-clinical mb-6 text-lg">
              {t('steps.personalInfo')}
            </h2>
            <StepPersonalInfo form={form} />
          </section>
        )}

        {/* ── Step 2: Enrollment Details ── */}
        {currentStep === 2 && (
          <section aria-labelledby="step2-heading">
            <h2 id="step2-heading" className="text-clinical mb-6 text-lg">
              {t('steps.enrollmentDetails')}
            </h2>
            <StepCourseDetails form={form} />
          </section>
        )}

        {/* ── Navigation buttons ── */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('nav.back')}
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isPending}
              className="ml-auto rounded bg-navy px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('nav.next')}
            </button>
          ) : (
            <button
              id="course-application-submit-btn"
              type="submit"
              disabled={isPending}
              className="ml-auto flex items-center gap-2 rounded bg-navy px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && <Spinner className="size-4" />}
              {t('nav.submit')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
