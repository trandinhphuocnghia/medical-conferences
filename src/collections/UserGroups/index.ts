import type { CollectionConfig } from 'payload'
import { adminOrOwner } from '@/access/adminOrOwner'
import { adminOrModifier } from '@/access/adminOrModifier'
import { authenticated } from '@/access/authenticated'
import { notAdminOrModifierView } from '@/access/collectionView'
import { anyone } from '@/access/anyone'

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
    hidden: notAdminOrModifierView,
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
      // filterOptions: () => ({
      //   roles: {
      //     in: ['admin', 'editor', 'user'],
      //   },
      // }),
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
        readOnly: true,
        allowEdit: false,
      },
      access: {
        create: () => false, // ✅ cannot be set manually via API
        update: () => false,
      },
    },
  ],

  timestamps: true,
}
