'use client'

import { ArrowLeft, BookOpen, GraduationCap, Microscope, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Command, Search } from 'lucide-react'
import { ChevronDown, Filter } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Course } from '@/payload-types'
import type { CourseCardData } from './course-card'
import { CourseGrid } from './course-grid'
import { formatDate } from '@/utilities/dateUtils'

// ── Types ─────────────────────────────────────────────────────────────────────
type Filters = {
  courseType: string
  targetAudience: string
  status: string
}

type CoursesArchiveProps = {
  initialCourses: Course[]
}

interface FilterOption {
  value: string
  label: string
}

// ── Mapper — Course → CourseCardData ─────────────────────────────────────────
function mapCourse(course: Course): CourseCardData {
  // Find the earliest upcoming batch date
  const now = new Date()
  const upcomingBatch = course.schedules
    ?.filter((s) => new Date(s.start_date) >= now)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]

  return {
    slug: course.slug,
    title: course.title,
    course_type: course.course_type,
    target_audience: course.target_audience,
    base_tuition_fee: course.base_tuition_fee,
    nextBatchDate: upcomingBatch?.start_date ?? null,
    nextBatchDisplay: upcomingBatch
      ? formatDate(upcomingBatch.start_date, { year: 'numeric', month: 'short', day: 'numeric' })
      : null,
  }
}

// ── FilterDropdown — same pill-shaped style as FilterBar ─────────────────────
interface FilterDropdownProps {
  icon: React.ReactNode
  label: string
  value: string
  options: FilterOption[]
  isOpen: boolean
  onToggle: () => void
  onChange: (value: string) => void
}

function FilterDropdown({
  icon,
  label,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}: FilterDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value) ?? options[0]
  const isDefault = value === 'all' || value === options[0].value

  return (
    <div className={`relative ${isOpen ? 'z-30' : ''}`}>
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all
          ${
            isDefault
              ? 'border-[#E2E8F0] bg-white text-[#0F172A]/70 hover:border-[#06B6D4]/50'
              : 'border-[#06B6D4] bg-[#06B6D4]/5 text-[#06B6D4]'
          }
        `}
      >
        {icon}
        <span className="hidden sm:inline">{label}:</span>
        <span className="font-medium">{selectedOption.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={onToggle} />
          <div className="absolute top-full left-0 mt-2 z-[100] min-w-[200px] rounded-xl border border-[#E2E8F0] bg-white shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm transition-colors
                  ${
                    option.value === value
                      ? 'bg-[#06B6D4]/10 text-[#06B6D4] font-medium'
                      : 'text-[#0F172A]/70 hover:bg-[#F8FAFC]'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Archive Component ────────────────────────────────────────────────────
export function CoursesArchive({ initialCourses }: CoursesArchiveProps) {
  const t = useTranslations('courses')

  const COURSE_TYPE_OPTIONS: FilterOption[] = useMemo(
    () => [
      { value: 'all', label: t('filter.allTypes') },
      { value: 'fixed', label: t('filter.scheduled') },
      { value: 'on_demand', label: t('filter.onDemand') },
    ],
    [t],
  )

  const TARGET_AUDIENCE_OPTIONS: FilterOption[] = useMemo(
    () => [
      { value: 'all', label: t('filter.allAudiences') },
      { value: 'surgeons', label: t('filter.surgeons') },
      { value: 'residents', label: t('filter.residents') },
      { value: 'medical_students', label: t('filter.medicalStudents') },
      { value: 'nurses', label: t('filter.nurses') },
      { value: 'researchers', label: t('filter.researchers') },
    ],
    [t],
  )

  const STATUS_OPTIONS: FilterOption[] = useMemo(
    () => [
      { value: 'all', label: t('filter.allStatuses') },
      { value: 'active', label: t('filter.active') },
      { value: 'upcoming', label: t('filter.upcoming') },
      { value: 'completed', label: t('filter.completed') },
    ],
    [t],
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    courseType: 'all',
    targetAudience: 'all',
    status: 'all',
  })

  // Map raw Payload docs to UI data
  const allCourses = useMemo(() => initialCourses.map(mapCourse), [initialCourses])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters =
    filters.courseType !== 'all' ||
    filters.targetAudience !== 'all' ||
    filters.status !== 'all'

  const clearFilters = () => {
    setFilters({ courseType: 'all', targetAudience: 'all', status: 'all' })
  }

  // Client-side filtering
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matches =
          course.title.toLowerCase().includes(q) ||
          (course.target_audience ?? '').toLowerCase().includes(q)
        if (!matches) return false
      }

      // Course type filter
      if (filters.courseType !== 'all') {
        if (course.course_type !== filters.courseType) return false
      }

      // Target audience filter
      if (filters.targetAudience !== 'all') {
        const audience = (course.target_audience ?? '').toLowerCase()
        const val = filters.targetAudience.toLowerCase()
        const valSpace = val.replace(/_/g, ' ')
        if (!audience.includes(val) && !audience.includes(valSpace)) return false
      }

      // Status filter — based on whether there is an upcoming batch
      if (filters.status !== 'all') {
        const hasUpcoming = course.nextBatchDate != null
        if (filters.status === 'upcoming' && !hasUpcoming) return false
        if (filters.status === 'completed' && hasUpcoming) return false
      }

      return true
    })
  }, [searchQuery, filters, allCourses])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Navigation — same sticky nav pattern as posts-archive ────── */}
      <nav className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#0F172A]/60 hover:text-[#06B6D4] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">{t('results.backToHome')}</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#06B6D4]/10">
                <Microscope className="h-4 w-4 text-[#06B6D4]" />
              </div>
              <span className="font-semibold text-[#0F172A]">HIGCF</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#0F172A]/50">
                {filteredCourses.length} {t('results.courses')}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">

          {/* ── Search Header — same bento panel structure ─────────────── */}
          <div className="w-full">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white/70 backdrop-blur-xl p-8 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] text-balance">
                    {t('results.title')}
                  </h1>
                  <p className="text-[#0F172A]/60 text-lg">
                    {t('results.description')}
                  </p>
                </div>

                {/* Search bar — same focus ring as SearchHeader */}
                <div className="relative">
                  <div
                    className={`
                      flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5
                      transition-all duration-200
                      ${
                        isFocused
                          ? 'border-[#06B6D4] ring-4 ring-[#06B6D4]/10'
                          : 'border-[#E2E8F0] hover:border-[#06B6D4]/50'
                      }
                    `}
                  >
                    <Search className="h-5 w-5 text-[#0F172A]/40" />
                    <input
                      id="course-search"
                      type="text"
                      placeholder={t('results.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="flex-1 bg-transparent text-[#0F172A] placeholder:text-[#0F172A]/40 focus:outline-none text-base"
                    />
                    {/* Cmd+K badge */}
                    <div className="hidden md:flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1">
                      <Command className="h-3.5 w-3.5 text-[#0F172A]/50" />
                      <span className="font-mono text-xs text-[#0F172A]/50">K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Filter Bar — same pill-shaped panel as FilterBar ─────────── */}
          <div className="relative z-20 rounded-xl border border-[#E2E8F0] bg-white/70 backdrop-blur-xl p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-2 text-[#0F172A]/60">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">{t('filter.filters')}</span>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-1">
                <FilterDropdown
                  icon={<BookOpen className="h-4 w-4" />}
                  label={t('filter.typeLabel')}
                  value={filters.courseType}
                  options={COURSE_TYPE_OPTIONS}
                  isOpen={openDropdown === 'courseType'}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === 'courseType' ? null : 'courseType')
                  }
                  onChange={(value) => {
                    handleFilterChange('courseType', value)
                    setOpenDropdown(null)
                  }}
                />

                <FilterDropdown
                  icon={<GraduationCap className="h-4 w-4" />}
                  label={t('filter.audienceLabel')}
                  value={filters.targetAudience}
                  options={TARGET_AUDIENCE_OPTIONS}
                  isOpen={openDropdown === 'targetAudience'}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === 'targetAudience' ? null : 'targetAudience')
                  }
                  onChange={(value) => {
                    handleFilterChange('targetAudience', value)
                    setOpenDropdown(null)
                  }}
                />

                <FilterDropdown
                  icon={<SlidersHorizontal className="h-4 w-4" />}
                  label={t('filter.statusLabel')}
                  value={filters.status}
                  options={STATUS_OPTIONS}
                  isOpen={openDropdown === 'status'}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === 'status' ? null : 'status')
                  }
                  onChange={(value) => {
                    handleFilterChange('status', value)
                    setOpenDropdown(null)
                  }}
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-[#0F172A]/60 hover:text-[#06B6D4] transition-colors"
                >
                  <X className="h-4 w-4" />
                  {t('filter.clearAll')}
                </button>
              )}
            </div>
          </div>

          {/* ── Results count ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#0F172A]/60">
              {t('results.showing')}{' '}
              <span className="font-semibold text-[#0F172A]">{filteredCourses.length}</span>{' '}
              {t('results.courses')}
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#0F172A]/50">{t('results.liveAvailability')}</span>
            </div>
          </div>

          {/* ── Course Grid ───────────────────────────────────────────── */}
          <CourseGrid courses={filteredCourses} />
        </div>
      </main>
    </div>
  )
}
