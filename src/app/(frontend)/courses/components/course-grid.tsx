'use client'

import { BookOpen } from 'lucide-react'
import type { CourseCardData } from './course-card'
import { CourseCard } from './course-card'

interface CourseGridProps {
  courses: CourseCardData[]
  isLoading?: boolean
}

export function CourseGrid({ courses, isLoading }: CourseGridProps) {
  // Skeleton loading state — same skeleton shape as ConferenceGrid
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#E2E8F0] bg-white/50 p-6 animate-pulse"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="h-6 w-24 bg-[#E2E8F0] rounded-md" />
              </div>
              <div className="h-6 w-full bg-[#E2E8F0] rounded-md" />
              <div className="h-6 w-3/4 bg-[#E2E8F0] rounded-md" />
              <div className="flex flex-col gap-2 mt-2">
                <div className="h-8 w-40 bg-[#E2E8F0] rounded-lg" />
                <div className="h-8 w-36 bg-[#E2E8F0] rounded-lg" />
              </div>
              <div className="h-px bg-[#E2E8F0] mt-2" />
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-[#E2E8F0] rounded" />
                <div className="h-4 w-16 bg-[#E2E8F0] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[#E2E8F0] bg-white/50">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4">
          <BookOpen className="h-8 w-8 text-[#0F172A]/30" />
        </div>
        <h3 className="text-lg font-semibold text-[#0F172A]/70 mb-1">No courses found</h3>
        <p className="text-sm text-[#0F172A]/50">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.slug} course={course} />
      ))}
    </div>
  )
}
