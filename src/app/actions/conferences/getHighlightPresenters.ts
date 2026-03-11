'use server'

import type { User, UserGroup } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { isHighlightPresenter, PresenterData, userToPresenterData } from '../shared/presenterUtils'

export async function getHighlightPresenters(conferenceId: number): Promise<{
  success: boolean
  presenters: PresenterData[]
  error?: string
}> {
  try {
    const payload = await getPayload({ config: configPromise })

    const conference = await payload.findByID({
      collection: 'posts',
      id: conferenceId,
      depth: 3,
    })

    if (!conference || !conference.host) {
      return { success: true, presenters: [] }
    }

    const hostGroup = conference.host as UserGroup
    const groupUsers = (hostGroup.users || []) as User[]

    // Highlight presenters: admin-created, non-staff, sorted by creation date (FIFO)
    const highlightPresenters = groupUsers
      .filter((user): user is User => !!user && isHighlightPresenter(user))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(userToPresenterData)

    // TODO: Type 2 Highlight Presenters (Users with approved abstracts)

    return {
      success: true,
      presenters: highlightPresenters,
    }
  } catch (error) {
    console.error('Error fetching highlight presenters:', error)
    return {
      success: false,
      presenters: [],
      error: 'Failed to fetch highlight presenters.',
    }
  }
}
