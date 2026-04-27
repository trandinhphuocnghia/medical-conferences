import type { Media, User } from '@/payload-types'

export type PresenterData = {
  id: string | number
  name: string
  email?: string
  organization?: string
  avatarUrl?: string
  bio?: any
  degrees?: string
  registrationType?: 'invited' | 'standard'
  nationality?: 'vietnamese' | 'international'
  abstracts: {
    id: string | number
    title: string
    topicName?: string
  }[]
  createdAt: string
}

/**
 * Maps a User object to a PresenterData object.
 * Shared between getConferencePresenters and getHighlightPresenters.
 */
export function userToPresenterData(user: User): PresenterData {
  const avatar = user.avatar && typeof user.avatar === 'object' ? (user.avatar as Media) : null

  return {
    id: user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User',
    email: user.email || undefined,
    organization: user.organization || undefined,
    avatarUrl: avatar?.url || undefined,
    bio: user.bio || undefined,
    degrees: user.degrees || undefined,
    registrationType: user.registrationType || 'standard',
    nationality: user.nationality || 'international',
    abstracts: [],
    createdAt: user.createdAt,
  }
}

const STAFF_ROLES: Set<string> = new Set(['admin', 'modifier'])

/**
 * Returns true if the user is a highlight presenter:
 * - source is 'admin-created'
 * - role is NOT admin or modifier
 */
export function isHighlightPresenter(user: User): boolean {
  return user.source === 'admin-created' && !STAFF_ROLES.has(user.role || '')
}
