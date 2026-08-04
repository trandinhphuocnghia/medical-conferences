'use server'

import type { User } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { type PresenterData, userToPresenterData } from '../shared/presenterUtils'

// Re-export so existing consumers don't break
export type { PresenterData } from '../shared/presenterUtils'

/**
 * Fetches verified abstracts for a specific conference and groups them by presenter.
 * Groups both authenticated users and anonymous submitters.
 */
export async function getConferencePresenters(conferenceId: number): Promise<{
  success: boolean
  presenters: PresenterData[]
  error?: string
}> {
  try {
    const payload = await getPayload({ config: configPromise })


    // Also fetch the conference host group to include all members as Invited Speakers
    const conference = await payload.findByID({
      collection: 'posts',
      id: conferenceId,
      depth: 3, // Populate host(1), users(2), and their avatars(3)
    })

    const presenterMap = new Map<string | number, PresenterData>()

    // Inject User Group Members into the Presenter list first
    if (conference?.host && typeof conference.host === 'object') {
      const hostGroup = conference.host as { users?: any[] }
      const groupUsers = (hostGroup.users || []) as User[]

      groupUsers.forEach((user) => {
        if (!user || user.role === 'admin') return // Exclude admins!
        const presenterData = userToPresenterData(user)
        if (!presenterMap.has(presenterData.id)) {
          presenterMap.set(presenterData.id, presenterData)
        }
      })
    }

    // Filter for ONLY Invited Speakers, then sort by createdAt
    const sortedPresenters = Array.from(presenterMap.values())
      .filter((p) => p.registrationType === 'invited')
      .sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })

    return {
      success: true,
      presenters: sortedPresenters,
    }
  } catch (error) {
    console.error('Error fetching conference presenters:', error)
    return {
      success: false,
      presenters: [],
      error: 'Failed to fetch presenters.',
    }
  }
}
