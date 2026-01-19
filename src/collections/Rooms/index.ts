import { adminOnly, authenticated } from '@/access/collectionAccess'
import { CollectionConfig } from 'payload'

/**
 * Feature seat booking.
 * Feature Room booking,
 */
export const Rooms: CollectionConfig = {
  slug: 'rooms',
  access: {
    admin: authenticated,
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Room name',
    },
    {
      name: 'totalSeat',
      type: 'number',
      required: true,
      label: 'total seat',
    },
  ],
}
