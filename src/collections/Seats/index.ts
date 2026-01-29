import { adminOnly, authenticated } from '@/access/collectionAccess'
import { CollectionConfig } from 'payload'

export const TICKET_TYPES = {
  VIP: 'VIP',
  MIDDLE: 'MIDDLE',
  FREE: 'FREE',
} as const

export type TicketType = (typeof TICKET_TYPES)[keyof typeof TICKET_TYPES]

export interface TicketOption {
  label: string
  value: TicketType
}

//TODO 20/1: check index of this collection.
export const TICKET_OPTIONS: TicketOption[] = [
  {
    label: 'VIP',
    value: TICKET_TYPES.VIP,
  },
  {
    label: 'Middle',
    value: TICKET_TYPES.MIDDLE,
  },
  {
    label: 'Free',
    value: TICKET_TYPES.FREE,
  },
]

export const Seats: CollectionConfig = {
  slug: 'seats',
  access: {
    admin: authenticated,
    read: authenticated,
    create: adminOnly,
    update: authenticated,
    delete: adminOnly,
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: TICKET_OPTIONS,
      index: true,
    },
    {
      name: 'room',
      type: 'relationship',
      relationTo: 'rooms',
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'available',
          value: 'AVAILABLE',
        },
        {
          label: 'on hold',
          value: 'ON_HOLD',
        },
        {
          label: 'sold',
          value: 'SOLD',
        },
      ],
      index: true,
    },
    {
      name: 'label',
      type: 'text',
      index: true,
    },
  ],
  indexes: [
    {
      fields: ['label', 'room'], //TODO 20/1: COMPOUND INDEX
      unique: true,
    },
  ],
}
