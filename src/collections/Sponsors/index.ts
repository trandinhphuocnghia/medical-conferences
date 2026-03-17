import { adminOrModifier, anyone } from '@/access/collectionAccess'
import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  access: {
    create: adminOrModifier,
    delete: adminOrModifier,
    read: anyone,
    update: adminOrModifier,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'bronze',
      options: [
        {
          label: 'Diamond',
          value: 'diamond',
        },
        {
          label: 'Gold',
          value: 'gold',
        },
        {
          label: 'Silver',
          value: 'silver',
        },
        {
          label: 'Bronze',
          value: 'bronze',
        },
      ],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
    },
  ],
  timestamps: true,
}
