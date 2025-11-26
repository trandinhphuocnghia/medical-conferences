import {
  adminOnly,
  adminOrOwner,
  authenticated,
} from '@/access/collectionAccess'
import { adminOnlyFieldAccess, userOnlyFieldAccess } from '@/access/fieldAccess'
import type { CollectionConfig } from 'payload'
import { checkExistAbstract } from './hooks/checkExistAbstract'

export const Abstracts: CollectionConfig = {
  slug: 'abstracts',

  access: {
    admin: authenticated,
    create: ({ req: { user, pathname } }) => {
      if (!user) return false

      if (pathname.includes('/admin')) return false

      return user.role === 'user'
    },
    delete: adminOnly,
    read: adminOrOwner,
    update: adminOrOwner,
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'conference', 'submitter', 'status', 'updatedAt'],
  },

  timestamps: true,

  fields: [
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      hasMany: false,
      label: 'Associated Conference',
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },

      admin: {
        description: 'Which conference this abstract is being submitted to.',
      },
    },

    {
      name: 'topic',
      type: 'relationship',
      relationTo: 'topics',
      required: true,
      hasMany: false,
      label: 'Specific Topic Area',
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
      admin: {
        description: 'The specific subject area (e.g., AI in Endoscopy).',
      },
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      label: 'Submitter/Author',
      defaultValue: ({ req }) => {
        return req.user?.id
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'Automatically populated with the logged-in user on submission.',
      },
    },

    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Abstract Title',
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Abstract Body Text',
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Keywords (Comma separated)',
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'files',
      type: 'array',
      label: 'Files',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
      access: {
        create: userOnlyFieldAccess,
        update: userOnlyFieldAccess,
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Verification Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Verified', value: 'verified' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
      required: true,

      access: {
        create: adminOnlyFieldAccess,
        update: ({ req, doc }) => {
          if (!req.user) return false
          if (req.user.role === 'user') return false
          return doc?.status === 'pending'
        },
      },
      admin: {
        position: 'sidebar',
        description: 'Set by Editors/Admins after peer review.',
      },
    },
    {
      name: 'reason',
      type: 'textarea',
      label: 'Reason for Rejection',
      access: {
        create: adminOnlyFieldAccess,
        update: ({ req, doc }) => {
          if (!req.user) return false
          if (req.user.role === 'user') return false
          return doc?.status === 'pending'
        },
      },
      admin: {
        position: 'sidebar',
        description: 'Set by Editors/Admins after peer review.',
        condition: ({ status }) => status === 'rejected',
      },
    },
  ],

  hooks: {
    beforeChange: [checkExistAbstract],
  },
}
