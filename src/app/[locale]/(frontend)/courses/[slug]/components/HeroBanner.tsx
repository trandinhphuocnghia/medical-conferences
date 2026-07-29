import type { Course } from '@/payload-types'
import { FileDown } from 'lucide-react'
import { formatVND } from '@/helpers'
import { CourseRegisterButton } from '@/components/common/course-register-button'

// ── Types ──────────────────────────────────────────────────────────────────────
type HeroBannerProps = Pick<
  Course,
  'title' | 'target_audience' | 'base_tuition_fee' | 'registration_url' | 'prospectus'
> & {
  badgeLabel?: string
  tuitionFeeLabel?: string
  tuitionFeeSuffix?: string
  ctaLabel?: string
}

// ── Component ─────────────────────────────────────────────────────────────────
export function HeroBanner({
  title,
  target_audience,
  base_tuition_fee,
  registration_url,
  prospectus,
  badgeLabel = 'Medical Training Course',
  tuitionFeeLabel = 'Tuition Fee',
  tuitionFeeSuffix = '/ course',
  ctaLabel = 'Register Now',
}: HeroBannerProps) {
  // Resolve prospectus media/file URL from Payload CMS relation
  const prospectusUrl =
    prospectus && typeof prospectus === 'object' && 'url' in prospectus
      ? prospectus.url
      : null

  return (
    <section
      aria-labelledby="hero-course-title"
      className="relative isolate overflow-hidden bg-background py-16 md:py-24"
    >
      {/* ── Subtle radial background glow (Navy → Cyan theme) ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.65 0.18 195 / 0.12), transparent 70%),
                       radial-gradient(ellipse 60% 40% at 0% 100%, oklch(0.22 0.05 250 / 0.06), transparent 60%)`,
        }}
      />

      {/* ── Medical dot-grid overlay ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 medical-grid-overlay opacity-60"
      />

      {/* ── Content wrapper ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 md:gap-8">

          {/* ── Eyebrow Badge ─────────────────────────────────────────── */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-accent animate-pulse"
            />
            <span className="text-meta font-medium text-accent">
              {badgeLabel}
            </span>
          </div>

          {/* ── H1: Course Title ──────────────────────────────────────── */}
          <h1
            id="hero-course-title"
            className="text-h1 text-clinical max-w-3xl"
          >
            {title}
          </h1>

          {/* ── Target Audience ───────────────────────────────────────── */}
          {target_audience && (
            <p className="medical-prose">
              {target_audience}
            </p>
          )}

          {/* ── Visual separator ──────────────────────────────────────── */}
          <div className="h-px w-16 bg-accent/40" />

          {/* ── Pricing Highlight ─────────────────────────────────────── */}
          {base_tuition_fee != null && (
            <div className="flex flex-col gap-1">
              <span className="text-meta uppercase tracking-widest">
                {tuitionFeeLabel}
              </span>
              <div className="inline-flex items-baseline gap-2">
                <span
                  className="text-3xl md:text-4xl font-extrabold tracking-tight"
                  style={{ color: 'var(--accent)' }}
                >
                  {formatVND(base_tuition_fee)}
                </span>
                <span className="text-meta">{tuitionFeeSuffix}</span>
              </div>
            </div>
          )}

          {/* ── CTA buttons container ─────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2 w-full sm:w-auto">
            {registration_url && (
              <CourseRegisterButton
                id="hero-cta-register"
                href={registration_url}
                ctaLabel={ctaLabel}
              />
            )}

            {prospectusUrl && (
              <a
                href={prospectusUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-primary px-8 py-4 text-base font-semibold text-primary hover:bg-primary/5 transition-all duration-200 ease-out hover:-translate-y-1 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-auto"
              >
                <FileDown className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
                <span>Download Brochure (PDF)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

