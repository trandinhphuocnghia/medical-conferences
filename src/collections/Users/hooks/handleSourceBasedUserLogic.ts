import type { CollectionBeforeValidateHook } from 'payload'
import crypto from 'crypto'

export const handleSourceBasedUserLogic: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (operation === 'create' && data) {
    const source = data.source || 'admin-created'

    if (source === 'admin-created') {
      // Auto-generate email if missing
      if (!data.email) {
        const randomId = crypto.randomBytes(4).toString('hex')
        data.email = `temp-${randomId}@higcf2026.org`
      }

      // Auto-generate password if missing
      if (!data.password) {
        data.password = crypto.randomBytes(32).toString('hex')
      }

      // Enforce inactive status for admin-created users
      data.active = false
    } else if (source === 'registration') {
      // For registration, we expect email/password from the user
      // and we ensure they are active (or follow system default)
      data.active = true
    }
  }

  return data
}
