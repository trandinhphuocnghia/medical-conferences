import { User } from '@/payload-types'
import type { FieldAccess } from 'payload'

export const adminOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) return user.role === 'admin'

  return false
}

export const modifierOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) return user.role === 'modifier'

  return false
}

export const userOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) return user.role === 'user'

  return false
}

export const adminExceptSelfFieldAccess: FieldAccess<User> = ({ req: { user, data } }) => {
  if (user) return user.role === 'admin' && user.id !== data?.id

  return false
}

export const draftOnlyFieldAccess: FieldAccess = ({ req: { user }, doc }) => {
  // Must be authenticated
  if (!user) return false

  if (user.role === 'admin') return false

  // Allow creation — Payload may pass {} instead of null for new docs
  if (!doc?.id) return true

  // Allow editing ONLY if status is draft (for both users and admins)
  // This preserves the integrity of submitted abstracts
  return doc.status === 'draft'
}
