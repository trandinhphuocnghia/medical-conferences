import { adminOrModifier, authenticated } from '@/access/collectionAccess'
import { adminOnlyFieldAccess, userOnlyFieldAccess } from '@/access/fieldAccess'
import type { CollectionConfig } from 'payload'

export const Abstracts: CollectionConfig = {
  slug: 'abstracts',

  hooks: {
    // beforeChange: [setSubmitter],
  },

  access: {
    admin: authenticated,
    // create: ({ req: { user, pathname } }) => {
    //   if (!user) return false

    //   if (pathname.includes('/admin')) return false

    //   return user.role === 'user'
    // },
    create: authenticated,
    delete: adminOrModifier,
    read: authenticated,
    update: authenticated,
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
      },

      admin: {
        description: 'Which conference this abstract is being submitted to.',
      },
    },
    {
      name: 'files',
      type: 'relationship',
      relationTo: 'files',
      required: true,
      hasMany: true,
      label: 'Files',

      admin: {
        description: '',
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
      },

      admin: {
        description: 'The specific subject area (e.g., AI in Endoscopy).',
      },
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      required: false,
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
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Abstract Body Text',
      access: {
        create: userOnlyFieldAccess,
      },
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Keywords (Comma separated)',
      access: {
        create: userOnlyFieldAccess,
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
        update: adminOnlyFieldAccess,
        create: userOnlyFieldAccess,
      },
      admin: {
        position: 'sidebar',
        description: 'Set by Editors/Admins after peer review.',
      },
    },
  ],
}
