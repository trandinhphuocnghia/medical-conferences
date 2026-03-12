import { adminOrModifier } from '@/access/collectionAccess'
import type { CollectionConfig } from 'payload'

export const Registrations: CollectionConfig = {
  slug: 'registrations',

  access: {
    create: () => true, // public — no login required
    read: adminOrModifier,
    update: adminOrModifier,
    delete: adminOrModifier,
  },

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullName', 'conference', 'joinTheGala', 'status', 'createdAt'],
  },

  timestamps: true,

  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== 'create' || !data?.email || !data?.conference) return data

        const existing = await req.payload.find({
          collection: 'registrations',
          where: {
            email: { equals: data.email },
            conference: { equals: data.conference },
          },
          limit: 1,
        })

        if (existing.totalDocs > 0) {
          throw new Error('This email address has already been registered for this conference.')
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'organization',
      type: 'text',
      maxLength: 200,
    },
    {
      name: 'joinTheGala',
      type: 'checkbox',
      label: 'Join the Gala Dinner?',
      defaultValue: false,
    },
    {
      name: 'notes',
      type: 'textarea',
      maxLength: 1000,
      admin: {
        description: 'Dietary restrictions, accessibility needs, or other notes.',
      },
    },
    // {
    //   name: 'status',
    //   type: 'select',
    //   defaultValue: 'pending',
    //   options: [
    //     { label: 'Pending', value: 'pending' },
    //     { label: 'Confirmed', value: 'confirmed' },
    //     { label: 'Cancelled', value: 'cancelled' },
    //   ],
    //   admin: {
    //     position: 'sidebar',
    //   },
    // },
  ],
}
