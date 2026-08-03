'use client'

import { Calendar, Coins } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Course } from '@/payload-types'
import { formatVND } from '@/helpers'
import { formatDate } from '@/utilities/dateUtils'

// ── Type ───────────────────────────────────────────────────────────────────────
export interface CourseCardData {
  slug: string
  title: string
  course_type: Course['course_type']
  target_audience?: string | null
  base_tuition_fee?: number | null
  nextBatchDate?: string | null      // ISO date string for the earliest upcoming batch
  nextBatchDisplay?: string | null   // Pre-formatted display string
}

// ── Badge colour map per course type ─────────────────────────────────────────
const courseTypeBadge: Record<Course['course_type'], { bg: string; text: string; labelKey: 'badge.scheduled' | 'badge.onDemand' }> = {
  fixed: { bg: 'bg-[#06B6D4]/10', text: 'text-[#06B6D4]', labelKey: 'badge.scheduled' },
  on_demand: { bg: 'bg-violet-50', text: 'text-violet-700', labelKey: 'badge.onDemand' },
}

// ── Component ─────────────────────────────────────────────────────────────────
export function CourseCard({ course }: { course: CourseCardData }) {
  const t = useTranslations('courses')
  const badge = courseTypeBadge[course.course_type] ?? courseTypeBadge.fixed

  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div
        className={`
          relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white/80 backdrop-blur-sm
          p-6 transition-all duration-300
          hover:shadow-xl hover:shadow-[#06B6D4]/5 hover:-translate-y-1 hover:border-[#06B6D4]/30
        `}
      >
        {/* Molecular background pattern — same as conference card */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <pattern
              id={`molecular-course-${course.slug}`}
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="2" fill="#0F172A" />
              <circle cx="40" cy="40" r="2" fill="#0F172A" />
              <circle cx="25" cy="25" r="3" fill="#06B6D4" />
              <line x1="10" y1="10" x2="25" y2="25" stroke="#0F172A" strokeWidth="0.5" />
              <line x1="25" y1="25" x2="40" y2="40" stroke="#0F172A" strokeWidth="0.5" />
              <circle cx="40" cy="10" r="1.5" fill="#0F172A" />
              <line x1="25" y1="25" x2="40" y2="10" stroke="#06B6D4" strokeWidth="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#molecular-course-${course.slug})`} />
          </svg>
        </div>

        {/* Content */}
        <div className="relative flex flex-col gap-4">
          {/* Course Type Badge */}
          <div className="flex items-start justify-between gap-3">
            <span
              className={`
                inline-flex px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide whitespace-nowrap
                ${badge.bg} ${badge.text}
              `}
            >
              {t(badge.labelKey)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#0F172A] leading-snug group-hover:text-[#06B6D4] transition-colors line-clamp-2 text-balance">
            {course.title}
          </h3>

          {/* Meta rows */}
          <div className="flex flex-col gap-2 mt-auto">
            {/* Meta 1 — Next Batch Date */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <Calendar className="h-4 w-4 text-[#0F172A]/60" />
              </div>
              <span className="font-mono text-sm text-[#0F172A]/70">
                {course.nextBatchDisplay
                  ? `Next Batch: ${course.nextBatchDisplay}`
                  : 'Schedule: TBD'}
              </span>
            </div>

            {/* Meta 2 — Tuition Fee */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <Coins className="h-4 w-4 text-[#0F172A]/60" />
              </div>
              <span className="text-sm text-[#0F172A]/70">
                {course.base_tuition_fee != null
                  ? `Tuition: ${formatVND(course.base_tuition_fee)}`
                  : 'Tuition: Contact us'}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <span className="text-xs text-[#0F172A]/50 truncate max-w-[70%]">
              {course.target_audience ?? 'Medical professionals'}
            </span>
            <span className="font-mono text-[10px] text-[#0F172A]/40 uppercase tracking-wider whitespace-nowrap">
              {t(badge.labelKey)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
