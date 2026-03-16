import type { CollectionConfig } from 'payload'

import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import { adminOrModifier, adminOrOwner, anyone, authenticated } from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'
import { slugField } from '@/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { author } from '@/utilities/collectionAuthor'
import { afterToday, beforeValidateDate } from './hooks/validation'
import { bioLexical } from '@/fields/bioLexical'
import { Post } from '@/payload-types'
import { validateCongressDate } from './hooks/congressValidation'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: {
    plural: 'Conferences',
    singular: 'Conferences',
  },

  access: {
    admin: authenticated,
    create: adminOrModifier,
    delete: adminOrOwner,
    read: anyone,
    update: adminOrOwner,
  },

  defaultPopulate: {
    title: true,
    slug: true,
    topics: true,
    host: true,
  },

  admin: {
    defaultColumns: ['title', 'slug', 'active', 'startDate', 'endDate', 'createdBy', 'updatedAt'],
    useAsTitle: 'title',
    hidden: userView,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Conference Title',
    },

    {
      name: 'theme',
      type: 'textarea',
      label: 'Conference Theme',
    },

    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Set to True when the conference program and registration are public.',
      },
      required: true,
    },

    {
      name: 'host',
      type: 'relationship',
      label: 'Host Organization (User Group/Admin)',
      relationTo: 'user-groups',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Primary host of the conference (e.g., Korean Gastric Cancer Association).',
      },
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Timing & Content',
          fields: [
            {
              name: 'venueName',
              type: 'text',
              label: 'Venue Name (e.g., Lotte Hotel Seoul)',
              required: true,
            },
            {
              name: 'venueCity',
              type: 'text',
              label: 'Venue City',
              required: true,
            },

            {
              name: 'topics',
              label: 'Content Topics',
              type: 'relationship',
              relationTo: 'topics',
              hasMany: true,
              admin: {
                description:
                  'Select the primary categories for abstracts and sessions (e.g., Surgical Oncology).',
              },
            },
          ],
        },
        {
          label: 'Schedule',
          fields: [
            // 1. Abstract Submission Deadline (First Event)
            {
              name: 'abstractSubmissionDeadline',
              type: 'date',
              label: 'Abstract Submission Deadline',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  minDate: afterToday,
                },
              },
            },
            // 2. Notification of Acceptance Date
            {
              name: 'notificationOfAcceptanceDate',
              type: 'date',
              label: 'Notification of Acceptance Date',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayAndTime', minDate: afterToday },
              },
            },
            // 3. Early Registration Deadline (Last Deadline)
            {
              name: 'earlyRegistrationDeadline',
              type: 'date',
              label: 'Early Registration Deadline',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayAndTime', minDate: afterToday },
              },
            },
            // 4. Start Date & Time (Sidebar, before End Date)
            {
              name: 'startDate',
              type: 'date',
              label: 'Start Date & Time',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  minDate: afterToday,
                },
                position: 'sidebar',
                description: 'Start date and time of the conference.',
              },
            },
            // 5. End Date & Time (Sidebar, after Start Date)
            {
              name: 'endDate',
              type: 'date',
              label: 'End Date & Time',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  minDate: afterToday,
                },
                position: 'sidebar',
                description: 'End date and time of the conference.',
              },
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'contactEmails',
              label: 'Secretariat Email Addresses',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [{ name: 'email', type: 'email', required: true }],
              admin: {
                description: 'List of official contact emails (e.g., secretariat@kingca.org)',
              },
            },
            {
              name: 'contactPhones',
              label: 'Secretariat Phone Numbers',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [{ name: 'phone', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'SEO & Related',
          name: 'meta',
          fields: [
            {
              name: 'relatedConferences',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return { id: { not_in: [id] } }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
        {
          label: 'Program',
          fields: [
            {
              name: 'program',
              type: 'array',
              label: 'Congresses',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'days',
                  type: 'array',
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                    },
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      validate: validateCongressDate,
                      admin: {
                        date: {
                          pickerAppearance: 'dayAndTime',
                          minDate: afterToday,
                        },
                      },
                    },
                    {
                      name: 'venue',
                      type: 'text',
                    },
                    {
                      name: 'content',
                      type: 'richText',
                      editor: bioLexical,
                    },
                  ],
                },
              ],
            },
          ],
        },
        //
      ],
    },
    ...slugField(),
    ...author,
  ],

  timestamps: true,
  trash: true,

  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
    beforeValidate: [beforeValidateDate],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
