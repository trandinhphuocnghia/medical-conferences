import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

export const userOnly: Access = ({ req: { user } }) => {
  if (user) return checkRole(['user'], user)

  return false
}
