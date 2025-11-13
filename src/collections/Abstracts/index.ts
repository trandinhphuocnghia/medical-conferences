import type { CollectionConfig } from 'payload'
// import { isSubmitterOrAdmin } from '../../access/accessFunctions' // [CORRECTION: Assuming this import path]
import { adminOrModifier } from '@/access/adminOrModifier'
import { userOnly } from '@/access/userOnly'
import { authenticated } from '../../access/authenticated'

export const Abstracts: CollectionConfig = {
  slug: 'abstracts',

  hooks: {
    // You would integrate your setSubmitter hook here
    // beforeChange: [setSubmitter],
  },

  // --- ACCESS CONTROL (CRITICAL) ---
  access: {
    admin: authenticated,
    create: userOnly,
    delete: adminOrModifier,
    read: authenticated,
    update: authenticated, //CHECK again, API need to config to admin can not call.
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'conference', 'verification_status', 'public_status', 'updatedAt'],
  },

  //Fields
  timestamps: true,

  // --- FIELDS (Mapped from Interface) ---
  fields: [
    // 1. RELATIONSHIPS (FKs)
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      hasMany: false,
      label: 'Associated Conference',

      admin: {
        readOnly: true,
        position: 'sidebar',
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

      admin: {
        readOnly: true,
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

      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatically populated with the logged-in user on submission.',
      },
    },

    // 2. CORE CONTENT
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Abstract Title',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Abstract Body Text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Keywords (Comma separated)',
      admin: {
        readOnly: true,
      },
    },

    // 3. WORKFLOW STATUS FIELDS
    {
      name: 'verification_status',
      type: 'select',
      label: 'Verification Status (Internal)',
      options: [
        { label: 'Pending Review', value: 'Pending' },
        { label: 'Verified', value: 'Verified' },
        { label: 'Rejected', value: 'Rejected' },
      ],
      defaultValue: 'Pending',
      required: true,

      access: {
        update: ({ req }) => !!adminOrModifier({ req }),
        create: ({ req }) => !!adminOrModifier({ req }),
      },
      admin: {
        position: 'sidebar',
        description: 'Set by Editors/Admins after peer review.',
      },
    },
  ],
}
