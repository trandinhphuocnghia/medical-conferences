import type { CollectionBeforeDeleteHook } from 'payload'

export const preventDeleteAdmin: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const payload = req.payload

  // Get the user being deleted
  const userToDelete = await payload.findByID({
    collection: 'users',
    id,
  })

  if (userToDelete?.roles?.includes('admin')) {
    throw new Error('Admin accounts cannot be deleted!')
  }
}
