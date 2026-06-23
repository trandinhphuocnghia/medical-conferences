import type { Course } from '@/payload-types'
import { formatVND } from '@/helpers'
import { CourseRegisterButton } from '@/components/common/course-register-button'

// ── Types ──────────────────────────────────────────────────────────────────────
type HeroBannerProps = Pick<
  Course,
  'title' | 'target_audience' | 'base_tuition_fee' | 'registration_url'
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
  badgeLabel = 'Medical Training Course',
  tuitionFeeLabel = 'Tuition Fee',
  tuitionFeeSuffix = '/ course',
  ctaLabel = 'Register Now',
}: HeroBannerProps) {
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

          {registration_url && (
            <CourseRegisterButton
              id="hero-cta-register"
              href={registration_url}
              ctaLabel={ctaLabel}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </section>
  )
}

