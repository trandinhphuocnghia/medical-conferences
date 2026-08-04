'use client'

import { CircleCheck } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
 * Constant — must match ApplicationForm.tsx exactly
 * ──────────────────────────────────────────────────────────────────────────── */
const DRAFT_STORAGE_KEY = 'courseApplicationDraft'

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */
interface ApplicantInfo {
  firstName: string
  email: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Loading Skeleton
 * Prevents hydration mismatch by rendering a neutral placeholder until the
 * client mounts and sessionStorage is safe to read.
 * ──────────────────────────────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-[480px]">
        {/* Icon placeholder */}
        <div className="size-16 rounded-full bg-muted animate-pulse" />
        {/* Heading placeholder */}
        <div className="h-8 w-56 rounded-lg bg-muted animate-pulse" />
        {/* Body placeholder */}
        <div className="space-y-2 w-full">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-4/5 mx-auto rounded bg-muted animate-pulse" />
        </div>
        {/* Button placeholders */}
        <div className="flex gap-3 mt-2">
          <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
          <div className="h-10 w-36 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CourseApplicationThankYouPage
 * ──────────────────────────────────────────────────────────────────────────── */
export default function CourseApplicationThankYouPage() {
  const t = useTranslations('CourseApplication')
  const locale = useLocale()

  // ── Hydration guard ───────────────────────────────────────────────────────
  // Render skeleton until client mounts so that any sessionStorage read doesn't
  // cause a server/client HTML mismatch.
  const [isMounted, setIsMounted] = useState(false)
  const [applicant, setApplicant] = useState<ApplicantInfo | null>(null)

  useEffect(() => {
    // Read and consume the draft exactly once — before any other render
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY)
      if (raw) {
        const draft = JSON.parse(raw)
        if (draft?.first_name && draft?.email) {
          setApplicant({ firstName: draft.first_name, email: draft.email })
        }
        // Consume: remove draft now that we've read the data we need
        sessionStorage.removeItem(DRAFT_STORAGE_KEY)
      }
    } catch {
      // sessionStorage unavailable or JSON invalid — render without personalization
    }

    setIsMounted(true)
  }, [])

  if (!isMounted) return <LoadingSkeleton />

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="flex flex-col items-center text-center max-w-[480px] mx-auto gap-6">

        {/* ── Success icon ── */}
        <CircleCheck
          size={64}
          className="text-[var(--cyan)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        {/* ── Heading ── */}
        <h1 className="text-2xl font-semibold text-foreground">
          {t('thankYou.heading')}
        </h1>

        {/* ── Body ── */}
        <p className="text-muted-foreground leading-relaxed">
          {applicant
            ? t('thankYou.withData', {
                firstName: applicant.firstName,
                email: applicant.email,
              })
            : t('thankYou.withoutData')}
        </p>

        {/* ── CTA buttons ── */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <Link
            href={`/${locale}`}
            className="rounded border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {t('thankYou.backToHome')}
          </Link>
          <Link
            href={`/${locale}/courses`}
            className="rounded bg-navy px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-navy-light transition-colors"
          >
            {t('thankYou.browseCourses')}
          </Link>
        </div>

      </div>
    </main>
  )
}
