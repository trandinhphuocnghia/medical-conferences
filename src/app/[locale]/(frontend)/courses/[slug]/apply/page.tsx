import type { Metadata } from 'next'
import type { Course } from '@/payload-types'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { PaginatedDocs } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { getInternalAPIHeaders } from '@/utilities/getInternalAPIHeaders'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ApplicationForm } from '@/components/CourseApplication/ApplicationForm'

// ── Constants ─────────────────────────────────────────────────────────────────
const SITE_NAME = 'Bệnh viện Đại học Y Dược TPHCM'
const DEFAULT_DESCRIPTION =
  'Chương trình đào tạo y khoa chất lượng cao tại Bệnh viện Đại học Y Dược TPHCM.'

// ── Data Fetching ─────────────────────────────────────────────────────────────
async function getCourseBySlug(slug: string, locale: string): Promise<Course | null> {
  try {
    const serverUrl = getServerSideURL()
    const url = `${serverUrl}/api/courses?where[slug][equals]=${slug}&depth=1&locale=${locale}`

    const response = await fetch(url, {
      headers: getInternalAPIHeaders(),
      // Don't over-cache the apply page — availability may change
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const res: PaginatedDocs<Course> = await response.json()
    return res.docs[0] ?? null
  } catch (error) {
    console.error('[apply/getCourseBySlug] Error:', error)
    return null
  }
}

// Deduplicate within the same render pass
const queryCourseBySlug = cache(getCourseBySlug)

// ── Route Types ───────────────────────────────────────────────────────────────
type Args = {
  params: Promise<{ slug: string; locale: string }>
}

// ── Dynamic Metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug, locale } = await paramsPromise
  const course = await queryCourseBySlug(slug, locale)

  if (!course || course.course_type !== 'on_demand' || !course.active) {
    return { title: SITE_NAME, description: DEFAULT_DESCRIPTION }
  }

  const title = `Apply — ${course.title} | ${SITE_NAME}`
  const serverUrl = getServerSideURL()
  const url = `${serverUrl}/${locale}/courses/${course.slug}/apply`

  return {
    title,
    description: DEFAULT_DESCRIPTION,
    openGraph: mergeOpenGraph({
      title,
      description: DEFAULT_DESCRIPTION,
      url,
      type: 'website',
    }),
    alternates: {
      canonical: url,
    },
  }
}

// ── Page Component ────────────────────────────────────────────────────────────
export default async function CourseApplyPage({ params: paramsPromise }: Args) {
  const { slug, locale } = await paramsPromise
  const course = await queryCourseBySlug(slug, locale)

  // ── Guard: must exist, be on_demand, and be currently active ──────────────
  // Fixed-schedule courses are not open for public on-demand applications.
  // Inactive courses are not accepting new applications.
  if (!course || course.course_type !== 'on_demand' || !course.active) {
    notFound()
  }

  return (
    <main className="py-10 px-4">
      <ApplicationForm courseId={course.id} courseTitle={course.title} />
    </main>
  )
}
