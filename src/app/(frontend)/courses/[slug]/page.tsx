import type { Metadata } from 'next'
import type { Course } from '@/payload-types'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { PaginatedDocs } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { CourseDetailView } from './components/CourseDetailView'

// ── Constants ─────────────────────────────────────────────────────────────────
const SITE_NAME = 'Bệnh viện Đại học Y Dược TPHCM'
const DEFAULT_DESCRIPTION =
  'Chương trình đào tạo y khoa chất lượng cao tại Bệnh viện Đại học Y Dược TPHCM.'

// ── Data Fetching (ISR — 1 hour) ──────────────────────────────────────────────
async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const serverUrl = getServerSideURL()
    const url = `${serverUrl}/api/courses?where[slug][equals]=${slug}&depth=3`

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const res: PaginatedDocs<Course> = await response.json()
    return res.docs[0] ?? null
  } catch (error) {
    console.error('[getCourseBySlug] Error:', error)
    return null
  }
}

// Deduplicate requests within the same render pass
const queryCourseBySlug = cache(getCourseBySlug)

// ── Route Types ───────────────────────────────────────────────────────────────
type Args = {
  params: Promise<{ slug: string }>
}

// ── Dynamic Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const course = await queryCourseBySlug(slug)

  if (!course) {
    return {
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
    }
  }

  const title = `${course.title} | ${SITE_NAME}`
  const description = course.target_audience
    ? course.target_audience.length > 160
      ? course.target_audience.slice(0, 157) + '...'
      : course.target_audience
    : DEFAULT_DESCRIPTION

  const serverUrl = getServerSideURL()
  const url = `${serverUrl}/courses/${course.slug}`

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      url,
      type: 'website',
    }),
    alternates: {
      canonical: url,
    },
  }
}

// ── JSON-LD Structured Data ───────────────────────────────────────────────────
function buildCourseJsonLd(course: Course) {
  const serverUrl = getServerSideURL()
  const description = course.target_audience || DEFAULT_DESCRIPTION

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description,
    url: `${serverUrl}/courses/${course.slug}`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: serverUrl,
    },
  }

  // Map fixed-course schedules into CourseInstance entries
  if (course.course_type === 'fixed' && course.schedules && course.schedules.length > 0) {
    jsonLd.hasCourseInstance = course.schedules.map((batch) => ({
      '@type': 'CourseInstance',
      name: batch.batch_name,
      courseMode: 'onsite',
      startDate: batch.start_date,
      endDate: batch.end_date,
    }))
  }

  // Add tuition fee if available
  if (course.base_tuition_fee != null) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: course.base_tuition_fee,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
    }
  }

  return jsonLd
}

// ── Page Component ────────────────────────────────────────────────────────────
export default async function CourseDetailPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const course = await queryCourseBySlug(slug)

  if (!course) notFound()

  const jsonLd = buildCourseJsonLd(course)

  return (
    <>
      {/* JSON-LD Structured Data — XSS-safe injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <CourseDetailView course={course} />
    </>
  )
}
