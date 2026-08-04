'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
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

const DRAFT_STORAGE_KEY = 'courseApplicationDraft'

const DEFAULT_VALUES: Partial<ApplicationFormValues> = {
  enrollment_type: 'short_course',
  has_organization: false,
}

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

  // ── Auto-save debounce timer ───────────────────────────────────────────────
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Build schema with translated messages ─────────────────────────────────
  const schema = useMemo(() => createApplicationFormSchema(t), [t])

  // ── react-hook-form ────────────────────────────────────────────────────────
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })

  // ── Task 2.4a — Silent draft restore on mount ─────────────────────────────
  // No popup, no confirmation — just silently hydrate the form if a draft exists.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY)
      if (raw) {
        const draftData = JSON.parse(raw)
        form.reset(draftData)
      }
    } catch {
      // sessionStorage unavailable or JSON invalid — ignore silently
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Task 2.4b — Auto-save draft (debounced 500 ms) ────────────────────────
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
      autosaveTimer.current = setTimeout(() => {
        try {
          sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values))
        } catch {
          // sessionStorage unavailable — ignore silently
        }
      }, 500)
    })
    return () => {
      subscription.unsubscribe()
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
  }, [form])

  // ── Step metadata (drives ProgressTracker labels) ──────────────────────────
  const steps = [
    { label: t('steps.personalInfo') },
    { label: t('steps.enrollmentDetails') },
  ]

  // ── Task 2.4c — Clear form handler ────────────────────────────────────────
  const handleClearForm = () => {
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      // ignore
    }
    form.reset(DEFAULT_VALUES)
    setCurrentStep(1)
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (currentStep === 1) {
      const step1Fields = STEP_1_FIELDS as Path<ApplicationFormValues>[]
      const isValid = await form.trigger(step1Fields)
      if (!isValid) return
    }
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, TOTAL_STEPS)
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
        // Redirect to locale-aware thank-you page.
        // The thank-you page reads the draft, extracts first_name + email,
        // then removes the key itself — so we do NOT clear it here.
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
      {/* ── Title row ── */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-clinical text-2xl">{t('title')}</h1>
        {/* Task 2.4c — Clear form button */}
        <button
          type="button"
          onClick={handleClearForm}
          className="text-sm text-muted-foreground hover:text-foreground underline transition-colors shrink-0 mt-0.5"
        >
          {t('nav.clearForm')}
        </button>
      </div>

      {courseTitle && (
        <p className="text-muted-foreground text-sm mb-4">{courseTitle}</p>
      )}

      {/* Step progress tracker */}
      <ProgressTracker currentStep={currentStep} totalSteps={TOTAL_STEPS} steps={steps} />

      <form noValidate>

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

        {/* ── Task 2.6 — Spacer so content isn't hidden behind the sticky bar on mobile ── */}
        <div className="h-20 md:h-0" />

        {/* ── Task 2.6 — Mobile Sticky CTA ── */}
        {/*
          Mobile:  fixed at bottom of viewport with safe-area inset + blur backdrop
          Desktop: static, no background, sits below the form fields with a top border
        */}
        <div
          className={[
            // Mobile: fixed sticky bar
            'fixed bottom-0 left-0 right-0 z-50',
            'p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]',
            'bg-background/95 backdrop-blur-sm',
            'border-t border-border',
            'shadow-[0_-2px_10px_rgba(0,0,0,0.05)]',
            // Desktop: back to static, clean
            'md:static md:bg-transparent md:backdrop-blur-none',
            'md:border-none md:shadow-none',
            'md:p-0 md:pb-0 md:mt-8 md:pt-6 md:border-t md:border-border',
          ].join(' ')}
        >
          <div className="flex justify-between items-center w-full">
            {/* Back button — only shown from step 2 onward */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('nav.back')}
              </button>
            ) : (
              // Empty placeholder to keep the primary CTA right-aligned on step 1
              <span />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isPending}
                className="rounded bg-navy px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('nav.next')}
              </button>
            ) : (
              <button
                id="course-application-submit-btn"
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                className="flex items-center gap-2 rounded bg-navy px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending && <Spinner className="size-4" />}
                {t('nav.submit')}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
