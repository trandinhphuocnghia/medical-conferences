import type { CollectionBeforeValidateHook } from 'payload'
import crypto from 'crypto'

export const handleSourceBasedUserLogic: CollectionBeforeValidateHook = ({ data, operation }) => {
  console.log(`[Users Hook] Operation: ${operation}, Source: ${data?.source}`)

  if (operation === 'create' && data) {
    // If source is missing, default it to 'admin-created' (matching schema default)
    if (!data.source) {
      data.source = 'admin-created'
      console.log(`[Users Hook] Defaulted source to 'admin-created'`)
    }

    const source = data.source

    if (source === 'admin-created') {
      // Auto-generate email if missing (allows creating users from admin panel with minimal info)
      if (!data.email) {
        const randomId = crypto.randomBytes(4).toString('hex')
        data.email = `temp-${randomId}@higcf2026.org`
        console.log(`[Users Hook] Generated temp email: ${data.email}`)
      }

      // Auto-generate password if missing
      if (!data.password) {
        data.password = crypto.randomBytes(32).toString('hex')
        console.log(`[Users Hook] Generated random password for admin-created user`)
      }

      // Enforce inactive status for admin-created users
      data.active = false
      console.log(`[Users Hook] Set active: false for admin-created user`)
    } else if (source === 'registration') {
      // For registration, we expect email/password from the user
      // and we ensure they are active (or follow system default)
      data.active = true
      console.log(`[Users Hook] Set active: true for registration user`)
    }
  }

  return data
}
