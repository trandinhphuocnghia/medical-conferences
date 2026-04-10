import { adminOrSubmitter, authenticated } from '@/access/collectionAccess'
import { draftOnlyFieldAccess } from '@/access/fieldAccess'
import type { CollectionConfig, Where } from 'payload'
import { beforeDelete } from './hooks/beforeDelete'
import { checkDeadline } from './hooks/checkDeadline'
import { checkValidStatus } from './hooks/checkValidStatus'
import { normalizeOtherTopic, restoreOtherTopic } from './hooks/handleOtherTopic'
import { sendAbstractEmailToQStash } from './hooks/sendAbstractEmail'

export const Abstracts: CollectionConfig = {
  slug: 'abstracts',

  access: {
    admin: authenticated,
    create: () => true, // public — no login required
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
            // Anonymous submitter contact info
            {
              type: 'row',
              admin: {
                // Hide anonymous contact fields when a linked user account exists
                condition: (data) => !data?.submitter,
              },
              fields: [
                {
                  name: 'submitterName',
                  type: 'text',
                  label: 'Full Name',
                  maxLength: 100,
                  required: false, // conditionally required only for anonymous
                  access: {
                    update: () => false, // read-only after creation
                  },
                  admin: { width: '50%', readOnly: true },
                },
                {
                  name: 'submitterEmail',
                  type: 'email',
                  label: 'Email Address',
                  required: false,
                  access: {
                    update: () => false,
                  },
                  admin: { width: '50%', readOnly: true },
                },
              ],
            },
            {
              name: 'submitterOrganization',
              type: 'text',
              label: 'Organization / Institution',
              maxLength: 200,
              access: {
                update: () => false,
              },
              admin: {
                readOnly: true,
                condition: (data) => !data?.submitter,
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  maxLength: 300,
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
                  required: false,
                  index: true,
                  access: {
                    update: draftOnlyFieldAccess,
                    create: draftOnlyFieldAccess,
                  },
                  admin: {
                    width: '50%',
                    components: {
                      Field: '@/collections/Abstracts/ui/TopicRadioField#TopicRadioField',
                    },
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
            {
              name: 'otherTopic',
              type: 'text',
              label: 'Please specify your topic',
              maxLength: 150,
              required: false,
              access: {
                update: draftOnlyFieldAccess,
                create: draftOnlyFieldAccess,
              },
              admin: {
                condition: (data) => !data?.topic || data?.topic === 'other',
                description: 'Enter a custom topic if none of the above apply.',
              },
              validate: (
                value: string | null | undefined,
                { data }: { data: Record<string, unknown> },
              ) => {
                // Required only when the user picked "Other" (topic is null/other)
                const hasStandardTopic = data?.topic && data.topic !== 'other'
                if (!hasStandardTopic && !value) {
                  return 'Please specify your topic or select one from the list.'
                }
                return true
              },
            },
            {
              name: 'presentationLanguage',
              type: 'select',
              label: 'Presentation Language',
              required: false, // enforced as required by the public form — optional here so admin-created records don't break
              options: [
                { label: 'English', value: 'english' },
                { label: 'Vietnamese', value: 'vietnamese' },
              ],
              access: {
                update: () => false, // set once at submission — admin cannot change
              },
              admin: {
                readOnly: true,
                description: 'Language the presenter will use during their session.',
              },
            },
          ],
        },

        // TAB 2: SCIENTIFIC CONTENT
        {
          label: '2. Abstract Body',
          fields: [
            {
              name: 'nameOfStudy',
              type: 'text',
              label: 'Name of the Study',
              maxLength: 300,
              access: { update: draftOnlyFieldAccess, create: draftOnlyFieldAccess },
            },
            {
              name: 'aim',
              type: 'textarea',
              label: 'Aim of Study',
              maxLength: 2000,
              required: true,
              access: { update: draftOnlyFieldAccess, create: draftOnlyFieldAccess },
              admin: { description: 'What is the objective of this study? (max 2000 characters)' },
            },
            {
              name: 'methods',
              type: 'textarea',
              label: 'Methods',
              maxLength: 3000,
              required: true,
              access: { update: draftOnlyFieldAccess, create: draftOnlyFieldAccess },
              admin: {
                description: 'Describe the study design and methodology. (max 3000 characters)',
              },
            },
            {
              name: 'results',
              type: 'textarea',
              label: 'Results',
              maxLength: 3000,
              required: true,
              access: { update: draftOnlyFieldAccess, create: draftOnlyFieldAccess },
              admin: { description: 'Summarize the key findings. (max 3000 characters)' },
            },
            {
              name: 'conclusion',
              type: 'textarea',
              label: 'Conclusion',
              maxLength: 2000,
              required: true,
              access: { update: draftOnlyFieldAccess, create: draftOnlyFieldAccess },
              admin: { description: 'What do the results mean? (max 2000 characters)' },
            },
            {
              name: 'keywords',
              type: 'array',
              label: 'Keywords',
              minRows: 1,
              maxRows: 5,
              access: { update: draftOnlyFieldAccess, create: draftOnlyFieldAccess },
              fields: [{ name: 'word', type: 'text', maxLength: 50 }],
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
              type: 'relationship',
              relationTo: 'public-files',
              hasMany: true,
              label: 'Supporting Files',
              access: {
                update: draftOnlyFieldAccess,
                create: draftOnlyFieldAccess,
              },
              admin: {
                description:
                  'Files uploaded client-side via Uploadthing. Each file is tracked separately in the public-files collection.',
              },
            },
            // ── Inline file preview links ─────────────────────────────────────
            {
              name: 'filesPreview',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/collections/Abstracts/ui/FilesPreview#FilesPreview',
                },
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
      defaultValue: ({ req }) => req.user?.id ?? null, // null for anonymous submissions
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Populated if the submitter had an account.',
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
    beforeChange: [normalizeOtherTopic, checkDeadline],
    afterChange: [sendAbstractEmailToQStash],
    afterRead: [restoreOtherTopic],
    beforeDelete: [beforeDelete],
  },
}
