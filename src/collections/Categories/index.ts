import type { CollectionConfig } from 'payload'

import {
  adminOnly,
  adminOrModifier,
  adminOrOwner,
  anyone,
  authenticated,
} from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    admin: authenticated,
    create: adminOrModifier,
    delete: adminOnly,
    read: anyone,
    update: adminOrOwner,
  },
  hooks: {},
  admin: {
    defaultColumns: ['name', 'isActive', 'updatedAt'],
    useAsTitle: 'name',
    hidden: userView,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
      admin: {
        description:
          'E.g., "Surgical Oncology" or "Translational Research". Must be unique.',
      },
      unique: true,
      index: true,
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Category Description (Optional)',
    },

    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Unchecking this soft-deletes the category (hides it from the frontend).',
      },
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Created By',
      defaultValue: ({ req }) => {
        return req.user?.id
      },
      admin: {
        readOnly: true,
        hidden: true,
        position: 'sidebar',
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Last Modified By',
      defaultValue: ({ req }) => {
        return req.user?.id
      },
      admin: {
        readOnly: true,
        hidden: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  trash: true,
}
