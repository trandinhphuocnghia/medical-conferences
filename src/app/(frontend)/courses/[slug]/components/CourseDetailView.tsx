import type { Course } from '@/payload-types'
import { HeroBanner } from './HeroBanner'
import { CourseSchedules } from './CourseSchedules'
import { CurriculumAccordion } from './CurriculumAccordion'
import { LogisticsPaymentSection } from './LogisticsPaymentSection'

type CourseDetailViewProps = {
  course: Course
}

export function CourseDetailView({ course }: CourseDetailViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <HeroBanner
        title={course.title}
        target_audience={course.target_audience}
        base_tuition_fee={course.base_tuition_fee}
        registration_url={course.registration_url}
        prospectus={course.prospectus}
        ctaLabel='Apply to Attend'
      />

      {course.course_type === 'fixed' && (
        <div className="mt-16 md:mt-20 flex flex-col gap-0">
          <CourseSchedules schedules={course.schedules} />
          <CurriculumAccordion curriculum={course.curriculum} />
        </div>
      )}

      {/* Logistics & Payment — bottom-of-funnel section */}
      <LogisticsPaymentSection
        logistics_info={course.logistics_info}
      />
    </div>
  )
}
