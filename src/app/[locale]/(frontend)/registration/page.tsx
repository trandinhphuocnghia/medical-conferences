import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { RegistrationForm } from './components/RegistrationForm'

export const metadata: Metadata = {
  title: 'Conference Registration | HIGCF',
  description: 'Register for upcoming HIGCF conferences.',
}

type Args = {
  searchParams: Promise<{ conference?: string }>
}

export default async function RegisterPage({ searchParams }: Args) {
  const { conference } = await searchParams
  const conferenceId = conference ? Number(conference) : null

  // ── Guard: block if a specific conference is requested and it has ended ────
  if (conferenceId && !isNaN(conferenceId)) {
    const payload = await getPayload({ config: configPromise })
    const doc = await payload.findByID({
      collection: 'posts',
      id: conferenceId,
      depth: 0,
      overrideAccess: true,
    }).catch(() => null)

    // If the conference doesn't exist or its endDate has already passed, 404.
    if (!doc || (doc.endDate && new Date() > new Date(doc.endDate))) {
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
        <RegistrationForm />
      </Suspense>
    </div>
  )
}
