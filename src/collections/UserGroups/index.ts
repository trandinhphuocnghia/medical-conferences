import type { CollectionConfig } from 'payload'
import {
  adminOrOwner,
  adminOrModifier,
  anyone,
  authenticated,
} from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'

export const UserGroups: CollectionConfig = {
  slug: 'user-groups',

  access: {
    admin: authenticated,
    read: anyone,
    create: adminOrModifier,
    update: adminOrOwner,
    delete: adminOrOwner,
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'users', 'updatedAt'],
    hidden: userView,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'users',
      label: 'Group Members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
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
}
