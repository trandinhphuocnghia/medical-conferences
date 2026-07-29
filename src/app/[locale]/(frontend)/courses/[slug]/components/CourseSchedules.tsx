import type { Course } from '@/payload-types'
import { formatDateRange } from '@/utilities/dateUtils'
import { formatVND } from '@/helpers'

type CourseSchedulesProps = {
  schedules?: NonNullable<Course['schedules']> | null
  titleLabel?: string
  tuitionOverrideLabel?: string
  locale?: string
}

export function CourseSchedules({
  schedules,
  titleLabel = 'Upcoming Batches & Schedules',
  tuitionOverrideLabel = 'Special Tuition Fee',
  locale = 'en-US',
}: CourseSchedulesProps) {
  if (!schedules || schedules.length === 0) return null

  return (
    <section aria-labelledby="course-schedules-title" className="bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">

          {/* ── Section Header ─────────────────────────────────────────── */}
          <div>
            <h2
              id="course-schedules-title"
              className="text-h2 text-clinical"
            >
              {titleLabel}
            </h2>
            <div className="mt-2 h-1 w-12 bg-accent rounded-full" />
          </div>

          {/* ── Responsive CSS Grid ────────────────────────────────────── */}
          <div className="grid gap-6 sm:grid-cols-2">
            {schedules.map((schedule) => {
              const { id, batch_name, start_date, end_date, tuition_fee_override } = schedule

              return (
                <div
                  key={id || batch_name}
                  className="flex flex-col justify-between p-6 bg-card border border-border rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                >
                  <div className="flex flex-col gap-2">
                    {/* Confident Batch Name Focal Point */}
                    <h3 className="text-lg font-semibold text-foreground tracking-tight">
                      {batch_name}
                    </h3>

                    {/* Softer Date Flow — with Calendar icon visual anchor */}
                    <p className="flex items-center gap-1.5 text-sm text-foreground/75 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 text-primary/60"
                        aria-hidden="true"
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      {formatDateRange(start_date, end_date, locale)}
                    </p>
                  </div>

                  {/* Optional Tuition Fee Override Badge */}
                  {tuition_fee_override != null && (
                    <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        {tuitionOverrideLabel}
                      </span>
                      <span className="text-base font-bold text-accent">
                        {formatVND(tuition_fee_override)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
