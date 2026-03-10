'use server'

import type { User, UserGroup } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { PresenterData } from '../abstracts/getConferencePresenters'

export async function getHighlightPresenters(conferenceId: number): Promise<{
  success: boolean
  presenters: PresenterData[]
  error?: string
}> {
  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Fetch the conference to get its host group
    const conference = await payload.findByID({
      collection: 'posts',
      id: conferenceId,
      depth: 3, // Populate host, host.users, and user.avatar/interests
    })

    if (!conference || !conference.host) {
      return { success: true, presenters: [] }
    }

    const hostGroup = conference.host as UserGroup
    const groupUsers = (hostGroup.users || []) as User[]

    // 2. Filter Type 1 Highlight Presenters
    // Logic: source === 'admin-created', exclude admin/modifier roles
    const highlightPresenters: PresenterData[] = groupUsers
      .filter((user) => {
        if (!user) return false
        const isHighlight = user.source === 'admin-created'
        const isNotStaff = user.role !== 'admin' && user.role !== 'modifier'
        return isHighlight && isNotStaff
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((user) => {
        return {
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User',
          email: user.email || undefined,
          organization: user.organization || undefined,
          avatarUrl: typeof user.avatar === 'object' ? (user.avatar as any)?.url : undefined,
          bio: user.bio,
          degrees: user.degrees || undefined,
          registrationType: user.registrationType || 'standard',
          abstracts: [], // Highlights might not have abstracts yet
        }
      })

    // 3. TODO: Type 2 Highlight Presenters (Users with approved abstracts)
    // For now, we ignore this as per instructions but leave this comment.

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
