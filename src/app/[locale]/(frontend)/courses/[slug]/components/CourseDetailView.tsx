import type { Course } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { HeroBanner } from './HeroBanner'
import { CourseSchedules } from './CourseSchedules'
import { CurriculumAccordion } from './CurriculumAccordion'
import { LogisticsPaymentSection } from './LogisticsPaymentSection'

type CourseDetailViewProps = {
  course: Course
  slug: string
  locale: string
}

export function CourseDetailView({ course, slug, locale }: CourseDetailViewProps) {
  const t = useTranslations('CourseDetail')
  const isFixed = course.course_type === 'fixed'

  // CTA props differ per course type:
  //   fixed     → external registration link (new tab)
  //   on_demand → internal /apply page (same window, Next.js Link)
  const ctaHref = isFixed ? (course.registration_url ?? '#') : `/${locale}/courses/${slug}/apply`
  const ctaIsExternal = isFixed
  const ctaLabel = isFixed ? t('ctaRegisterExternal') : t('ctaApplyToAttend')

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner
        title={course.title}
        target_audience={course.target_audience}
        base_tuition_fee={isFixed ? course.base_tuition_fee : null}
        prospectus={course.prospectus}
        ctaHref={ctaHref}
        ctaIsExternal={ctaIsExternal}
        ctaLabel={ctaLabel}
        badgeLabel={t('badgeLabel')}
        tuitionFeeLabel={t('tuitionFeeLabel')}
        tuitionFeeSuffix={t('tuitionFeeSuffix')}
        contactForPricing={t('contactForPricing')}
        downloadBrochure={t('downloadBrochure')}
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
