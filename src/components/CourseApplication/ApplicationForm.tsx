'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'
import { useForm, type Path } from 'react-hook-form'

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
 * ApplicationForm
 * ──────────────────────────────────────────────────────────────────────────── */
export function ApplicationForm() {
  const t = useTranslations('CourseApplication')

  // ── Step state ─────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1)

  // ── Scroll anchor — smooth-scrolls to the top of the card on step change ──
  const formContainerRef = useRef<HTMLDivElement>(null)

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
    // TODO: wire to a Next.js Server Action
    console.log('[ApplicationForm] submitted:', values)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={formContainerRef}
      className="mx-auto max-w-[640px] min-h-[500px] bg-card rounded-2xl shadow-md border border-border p-6 md:p-10"
    >
      {/* Title */}
      <h1 className="text-clinical mb-2 text-2xl">{t('title')}</h1>

      {/* Step progress tracker */}
      <ProgressTracker currentStep={currentStep} totalSteps={TOTAL_STEPS} steps={steps} />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {/* ── Step 1: Personal Information placeholder ── */}
        {currentStep === 1 && (
          <section aria-labelledby="step1-heading">
            <h2 id="step1-heading" className="text-clinical mb-6 text-lg">
              {t('steps.personalInfo')}
            </h2>
            <StepPersonalInfo form={form} />
          </section>
        )}

        {/* ── Step 2: Enrollment Details placeholder ── */}
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
              className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              {t('nav.back')}
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto rounded bg-navy px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-navy-light transition-colors"
            >
              {t('nav.next')}
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto rounded bg-navy px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-navy-light transition-colors"
            >
              {t('nav.submit')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
