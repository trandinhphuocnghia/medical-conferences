'use server'

import type { Abstract, Topic, User } from '@/payload-types'
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

    const { docs: abstracts } = await payload.find({
      collection: 'abstracts',
      where: {
        conference: {
          equals: conferenceId,
        },
        status: {
          equals: 'verified',
        },
      },
      depth: 2, // Populate submitter (User) and topic
      limit: 100,
    })

    const presenterMap = new Map<string | number, PresenterData>()

    abstracts.forEach((abs: Abstract) => {
      let presenterEntry: PresenterData

      if (abs.submitter && typeof abs.submitter === 'object') {
        presenterEntry = userToPresenterData(abs.submitter as User)
      } else {
        // Anonymous submitter
        presenterEntry = {
          id: `anon-${abs.submitterEmail || abs.id}`,
          name: abs.submitterName || 'Anonymous',
          email: abs.submitterEmail || undefined,
          organization: abs.submitterOrganization || undefined,
          abstracts: [],
        }
      }

      const topicName =
        abs.topic && typeof abs.topic === 'object' ? (abs.topic as Topic).name : abs.otherTopic

      if (!presenterMap.has(presenterEntry.id)) {
        presenterMap.set(presenterEntry.id, presenterEntry)
      }

      presenterMap.get(presenterEntry.id)!.abstracts.push({
        id: abs.id as string | number,
        title: abs.title,
        topicName: topicName as string | undefined,
      })
    })

    // Sort by registrationType (invited first) then name
    const sortedPresenters = Array.from(presenterMap.values()).sort((a, b) => {
      if (a.registrationType === 'invited' && b.registrationType !== 'invited') return -1
      if (a.registrationType !== 'invited' && b.registrationType === 'invited') return 1
      return a.name.localeCompare(b.name)
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
