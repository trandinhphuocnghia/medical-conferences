import type { Access, AccessArgs } from 'payload'

import { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const anyone: Access = () => true

export const noone: Access = () => false

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user?.id)
}

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const adminOnly: Access = ({ req: { user } }) => {
  if (user) return user.role === 'admin'

  return false
}

export const modifierOnly: Access = ({ req: { user } }) => {
  if (user) return user.role === 'modifier'

  return false
}

export const adminOrModifier: Access = ({ req: { user } }) => {
  if (user) return user.role === 'admin' || user.role === 'modifier'

  return false
}

export const adminOrOwner: Access = ({ req: { user } }) => {
  if (user && user.role === 'admin') {
    return true
  }

  if (user?.id) {
    return {
      id: {
        equals: user.id,
      },
    }
  }

  return false
}

export const userOnly: Access = ({ req: { user } }) => {
  if (user) return user.role === 'user'

  return false
}
