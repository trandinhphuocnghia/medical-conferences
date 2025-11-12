import type { Access } from 'payload'

import { checkRole } from '@/access/utilities'

export const adminOrModifier: Access = ({ req: { user } }) => {
  if (user) return checkRole(['admin', 'modifier'], user)

  return false
}
