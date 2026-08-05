import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { AbstractSubmitForm } from './components/AbstractSubmitForm'

export const metadata: Metadata = {
  title: 'Submit Abstract | HIGCF',
  description: 'Submit your scientific abstract for review at HIGCF conferences.',
}

type Args = {
  searchParams: Promise<{ conference?: string }>
}

export default async function SubmitAbstractPage({ searchParams }: Args) {
  const { conference } = await searchParams
  const conferenceId = conference ? Number(conference) : null

  // ── Guard: block if a specific conference is requested and submission is closed ──
  if (conferenceId && !isNaN(conferenceId)) {
    const payload = await getPayload({ config: configPromise })
    const doc = await payload.findByID({
      collection: 'posts',
      id: conferenceId,
      depth: 0,
      overrideAccess: true,
    }).catch(() => null)

    // 404 if the conference doesn't exist.
    if (!doc) notFound()

    // 404 if the submission deadline has passed.
    // If no deadline is set, we allow access (open submission).
    if (doc.abstractSubmissionDeadline && new Date() > new Date(doc.abstractSubmissionDeadline)) {
      notFound()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        }
      >
        <AbstractSubmitForm />
      </Suspense>
    </div>
  )
}
