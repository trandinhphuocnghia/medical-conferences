import { CollectionConfig } from 'payload'

export const Reservations: CollectionConfig = {
  slug: 'reservations',
  access: {},
  fields: [
    {
      name: 'seat',
      relationTo: 'seats',
      type: 'relationship',
    },
    {
      name: 'user',
      relationTo: 'users',
      type: 'relationship',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'PENDING',
        },
        {
          label: 'Confirmed',
          value: 'CONFIRMED',
        },
        {
          label: 'Cancelled',
          value: 'CANCELLED',
        },
      ],
    },
  ],
}
