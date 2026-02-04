import { adminOrSubmitter, authenticated } from '@/access/collectionAccess'
import { draftOnlyFieldAccess } from '@/access/fieldAccess'
import { scientificLexical } from '@/fields/scientificLexical'
import type { CollectionConfig, Where } from 'payload'
import { beforeDelete } from './hooks/beforeDelete'
import { checkDeadline } from './hooks/checkDeadline'
import { checkExistAbstract } from './hooks/checkExistAbstract'
import { checkValidStatus } from './hooks/checkValidStatus'
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
                  access: {
                    update: draftOnlyFieldAccess,
                    create: draftOnlyFieldAccess,
                  },
                  admin: {
                    width: '100%',
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
                  index: true,
                  access: {
                    update: draftOnlyFieldAccess,
                    create: draftOnlyFieldAccess,
                  },
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'topic',
                  type: 'relationship',
                  relationTo: 'topics',
                  required: true,
                  index: true,
                  access: {
                    update: draftOnlyFieldAccess,
                    create: draftOnlyFieldAccess,
                  },
                  admin: {
                    width: '50%',
                  },
                  filterOptions: ({ data }): Where => {
                    return {
                      conference: {
                        in: data.conference ? [data.conference] : [-1], //<- query to no
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
              type: 'richText',
              editor: scientificLexical,
              required: true,
              label: 'Main Content',
              access: {
                update: draftOnlyFieldAccess,
                create: draftOnlyFieldAccess,
              },
              admin: {
                description: 'Structure: Introduction, Methods, Results, Conclusion.',
              },
            },
            {
              name: 'keywords',
              type: 'array',
              label: 'Keywords',
              minRows: 1,
              maxRows: 5,
              access: {
                update: draftOnlyFieldAccess,
                create: draftOnlyFieldAccess,
              },
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
              type: 'upload',
              relationTo: 'files',
              hasMany: true,
              label: 'Supporting Images/Charts',
              access: {
                update: draftOnlyFieldAccess,
                create: draftOnlyFieldAccess,
              },
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
      index: true,
      defaultValue: ({ req }) => req.user?.id,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      access: {
        update: () => false,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Summit for Review', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Verified', value: 'verified' },
      ],
      index: true,
      hooks: {
        beforeChange: [checkValidStatus],
      },
      admin: {
        position: 'sidebar',
        description: 'Users can only set Draft or Pending. Admins manage review statuses.',
        components: {
          Field: '@/collections/Abstracts/ui/StatusSelectComponent#StatusSelectComponent',
        },
      },
    },
  ],

  hooks: {
    beforeChange: [checkDeadline, checkExistAbstract],
    //TODO: MUST
    /*
    1. define mail_logs collections.
    2. define API cron-jon.
    */
    afterChange: [sendAbstractEmail],
    beforeDelete: [beforeDelete],
  },
}
