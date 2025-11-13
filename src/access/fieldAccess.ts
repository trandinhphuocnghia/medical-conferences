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
