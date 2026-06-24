import type { Metadata } from 'next'
import type { Course } from '@/payload-types'
import { cache } from 'react'

import { getServerSideURL } from '@/utilities/getURL'
import { getInternalAPIHeaders } from '@/utilities/getInternalAPIHeaders'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { CoursesArchive } from './components/courses-archive'

// ── Constants ─────────────────────────────────────────────────────────────────
const SITE_NAME = 'Bệnh viện Đại học Y Dược TPHCM'
const PAGE_TITLE = `Medical Training Courses | ${SITE_NAME}`
const PAGE_DESCRIPTION =
  'Browse our certified clinical training programs and hands-on workshops.'

// ── Data Fetching (ISR — 1 hour) ──────────────────────────────────────────────
// NOTE: searchParams are intentionally NOT read here. All filtering is handled
// client-side inside <CoursesArchive> to preserve ISR across all URL variations.
const getCourses = cache(async (): Promise<Course[]> => {
  try {
    const serverUrl = getServerSideURL()
    const url = `${serverUrl}/api/courses?where[active][equals]=true&limit=100&depth=1`

    const res = await fetch(url, {
      headers: getInternalAPIHeaders(),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`[getCourses] HTTP ${res.status}`)
    }

    const data: { docs: Course[] } = await res.json()
    return data.docs
  } catch (error) {
    console.error('[getCourses] Failed to fetch courses:', error)
    return []
  }
})

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const serverUrl = getServerSideURL()
  const canonicalUrl = `${serverUrl}/courses`

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: mergeOpenGraph({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: canonicalUrl,
      type: 'website',
    }),
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

// ── JSON-LD Builder ───────────────────────────────────────────────────────────
function buildItemListJsonLd(courses: Course[]) {
  const serverUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Medical Training Courses',
    description: PAGE_DESCRIPTION,
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        url: `${serverUrl}/courses/${course.slug}`,
      },
    })),
  }
}

// ── Page Component ────────────────────────────────────────────────────────────
export default async function CoursesPage() {
  const courses = await getCourses()
  const jsonLd = buildItemListJsonLd(courses)

  return (
    <>
      {/* JSON-LD Structured Data — XSS-safe injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Semantic page header — server-rendered for SEO */}
      <header className="sr-only">
        <h1>Explore Medical Training Courses</h1>
        <p>{PAGE_DESCRIPTION}</p>
      </header>

      {/* All search, filter, and pagination logic lives client-side */}
      <CoursesArchive initialCourses={courses} />
    </>
  )
}
