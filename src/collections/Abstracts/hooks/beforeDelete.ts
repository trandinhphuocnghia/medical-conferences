import { adminOnly } from '@/access/collectionAccess'
import { Access } from 'payload'

export const beforeDelete: Access = async ({ req, id }) => {
  if (!adminOnly({ req: req })) {
    return false
  }

  if (!id) return false

  const docToDelete = await req.payload.findByID({
    collection: 'abstracts',
    id: id,
    depth: 0,
    overrideAccess: false,
    req: req,
  })

  if (docToDelete && docToDelete.status === 'rejected') {
    return true
  }

  return false
}
