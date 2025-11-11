import type { CollectionBeforeChangeHook } from 'payload'

/**
 * @param param0
 * @returns created_by, updated_by.
 */
export const setCurrentInteract: CollectionBeforeChangeHook = ({ req, data, operation }) => {
  // Ensure we have a logged-in user (req.user) to set the ID
  if (req.user) {
    const userId = req.user.id

    // 1. Set 'created_by' ONLY on creation
    if (operation === 'create') {
      // We set the field on the data payload before it is saved
      data.created_by = userId
    }

    // 2. Set 'updated_by' on BOTH create and update operations
    // This is generally convention for "last modifier"
    if (operation === 'create' || operation === 'update') {
      data.updated_by = userId
    }
  }

  return data
}
