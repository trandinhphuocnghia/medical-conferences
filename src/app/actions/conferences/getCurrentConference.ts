'use server'
import { Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Fetches the current or next upcoming conference.
 *
 * Rules:
 *  - must be active (admin-controlled toggle)
 *  - endDate must be in the future (not yet ended)
 *  - sorted by startDate ASC → nearest conference first
 */
export async function getCurrentConference(): Promise<Post | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date().toISOString()

    const res = await payload.find({
      collection: 'posts',
      where: {
        and: [{ active: { equals: true } }, { endDate: { greater_than_equal: now } }],
      },
      sort: 'startDate', // nearest upcoming first
      limit: 1,
      depth: 0,
      overrideAccess: true,
      select: {
        title: true,
        slug: true,
        theme: true,
        startDate: true,
        endDate: true,
        venueName: true,
        venueCity: true,
        abstractSubmissionDeadline: true,
      },
    })

    return (res.docs[0] as Post) ?? null
  } catch {
    return null
  }
}
