'use server'

import type { Abstract } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'

export type PresenterData = {
  id: string | number
  name: string
  email?: string
  organization?: string
  avatarUrl?: string
  bio?: any
  registrationType?: 'invited' | 'standard'
  abstracts: {
    id: string | number
    title: string
    topicName?: string
  }[]
}

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
      let presenterId: string | number
      let name: string
      let organization: string | undefined
      let email: string | undefined
      let avatarUrl: string | undefined
      let bio: any = null
      let regType: 'invited' | 'standard' = 'standard'

      if (abs.submitter && typeof abs.submitter === 'object') {
        const user = abs.submitter as any // Use any temporarily if types are not updated
        presenterId = user.id
        name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User'
        organization = user.organization || undefined
        email = user.email
        avatarUrl = typeof user.avatar === 'object' ? (user.avatar as any)?.url : undefined
        bio = user.bio
        regType = user.registrationType || 'standard'
      } else {
        // Anonymous submitter
        presenterId = `anon-${abs.submitterEmail || abs.id}`
        name = abs.submitterName || 'Anonymous'
        organization = abs.submitterOrganization || undefined
        email = abs.submitterEmail || undefined
      }

      const topicName =
        abs.topic && typeof abs.topic === 'object' ? (abs.topic as any)?.name : abs.otherTopic

      if (!presenterMap.has(presenterId)) {
        presenterMap.set(presenterId, {
          id: presenterId,
          name,
          email,
          organization,
          avatarUrl,
          bio,
          registrationType: regType,
          abstracts: [],
        })
      }

      presenterMap.get(presenterId)!.abstracts.push({
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
