import type { CollectionConfig } from 'payload'
import { adminOrOwner, adminOrModifier, anyone, authenticated } from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'
import { author } from '@/utilities/collectionAuthor'

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
    defaultColumns: ['name', 'users', 'createdBy', 'updatedAt'],
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
    ...author,
  ],

  timestamps: true,
}
