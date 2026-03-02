import { Abstract } from '@/payload-types'
import { APIError, FieldHook } from 'payload'

export const checkValidStatus: FieldHook<Abstract> = async ({ req, originalDoc, value }) => {
  // If no change, or no value, return value (allow)
  if (!value || value === originalDoc?.status) {
    return value
  }

  const role = req.user?.role

  // 1. Logic for Users
  if (role === 'user') {
    // Cannot change to admin-only statuses
    if (['rejected', 'verified'].includes(value)) {
      throw new APIError('You are not authorized to set this status.', 403, null, true)
    }

    // "can not change from pending to draft"
    if (originalDoc?.status === 'pending' && value === 'draft') {
      throw new APIError('Cannot revert to draft once pending.', 400, null, true)
    }

    // Implicitly allows draft -> pending
  }

  // 2. Logic for Admins
  if (role === 'admin') {
    // "just works with rejected or verified"
    // Meaning admins should not be transitioning TO draft or pending from other states
    // (They typically move things forward)
    if (['draft', 'pending'].includes(value)) {
      throw new APIError(
        'Admins effectively only manage Rejected, or Verified statuses.',
        400,
        null,
        true,
      )
    }
  }

  return value
}
