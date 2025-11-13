import type { CollectionBeforeDeleteHook } from 'payload'

export const preventDeleteAdminOrSelf: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const payload = req.payload

  // Get the user being deleted
  const userToDelete = await payload.findByID({
    collection: 'users',
    id,
  })

  if (userToDelete?.role === 'admin') {
    throw new Error('Admin accounts cannot be deleted!')
  }

  if (userToDelete?.id === req.user?.id) {
    throw new Error('You cannot delete yourself!')
  }
}
