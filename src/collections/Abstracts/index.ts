import { adminOrSubmitter, authenticated } from '@/access/collectionAccess'
import { adminOnlyFieldAccess } from '@/access/fieldAccess'
import type { CollectionConfig, Where } from 'payload'
import { beforeDelete } from './hooks/beforeDelete'
import { checkExistAbstract } from './hooks/checkExistAbstract'
import { sendAbstractEmail } from './hooks/sendAbstractEmail'

export const Abstracts: CollectionConfig = {
  slug: 'abstracts',

  access: {
    admin: authenticated,
    create: ({ req: { user } }) => {
      if (!user) return false

      return user.role === 'user'
    },
    read: adminOrSubmitter,
    update: adminOrSubmitter,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'conference', 'submitter', 'status', 'updatedAt'],
  },
  timestamps: true,

  fields: [
    {
      type: 'tabs',
      tabs: [
        // TAB 1: CORE DETAILS
        {
          label: '1. Submission Info',
          fields: [
            {
              name: 'submitterProfilePreview',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/Abstracts/Submitter',
                },
                condition: (_, __, { user }) => user?.role === 'admin',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '100%',
                    readOnly: !Boolean(adminOnlyFieldAccess),
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'conference',
                  type: 'relationship',
                  relationTo: 'posts',
                  required: true,
                  admin: {
                    width: '50%',
                    readOnly: !Boolean(adminOnlyFieldAccess),
                  },
                },
                {
                  name: 'topic',
                  type: 'relationship',
                  relationTo: 'topics',
                  required: true,
                  admin: {
                    width: '50%',
                    readOnly: !Boolean(adminOnlyFieldAccess),
                  },
                  filterOptions: ({ data }): Where => {
                    return {
                      conference: {
                        in: data.conference ? [data.conference] : [-1],
                      },
                      active: { equals: true },
                    } as Where
                  },
                },
              ],
            },
          ],
        },

        // TAB 2: SCIENTIFIC CONTENT
        {
          label: '2. Abstract Body',
          fields: [
            {
              name: 'description',
              type: 'richText', // As discussed, use Lexical for italics/superscripts
              required: true,
              label: 'Main Content',
              admin: {
                description:
                  'Structure: Introduction, Methods, Results, Conclusion.',
              },
            },
            {
              name: 'keywords',
              type: 'array',
              label: 'Keywords',
              minRows: 1,
              maxRows: 5,
              fields: [{ name: 'word', type: 'text' }],
              admin: { description: 'Add up to 5 keywords for indexing.' },
            },
          ],
        },

        // TAB 3: SUPPLEMENTARY
        {
          label: '3. Figures & Files',
          fields: [
            {
              name: 'files',
              type: 'upload', // Better than 'text' URL - link to Media collection
              relationTo: 'media',
              hasMany: true,
              label: 'Supporting Images/Charts',
            },
          ],
        },
      ],
    },

    // SIDEBAR FIELDS (The metadata)
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        /* your options */
      ],
      admin: { position: 'sidebar' },
    },
  ],

  hooks: {
    beforeChange: [checkExistAbstract],
    afterChange: [sendAbstractEmail],
    beforeDelete: [beforeDelete],
  },
}
