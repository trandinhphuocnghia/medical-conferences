import type { CollectionConfig } from 'payload'

import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import { slugField } from '@/fields/slug'
import { userView } from '@/access/collectionView'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { adminOrModifier, adminOrOwner, anyone, authenticated } from '@/access/collectionAccess'

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
    // meta: {
    //   image: true,
    //   description: true,
    // },
    // likes: true,
    host_organization: true,
  },

  admin: {
    defaultColumns: ['title', 'slug', 'is_active', 'startDate', 'endDate', 'updatedAt'],
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
      name: 'is_active',
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
      name: 'host_organization',
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
              name: 'venue_name',
              type: 'text',
              label: 'Venue Name (e.g., Lotte Hotel Seoul)',
              required: true,
            },
            {
              name: 'venue_city',
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
          label: 'Deadlines',
          fields: [
            {
              name: 'abstract_submission_deadline',
              type: 'date',
              label: 'Abstract Submission Deadline',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'early_registration_deadline',
              type: 'date',
              label: 'Early Registration Deadline',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
            {
              name: 'notification_of_acceptance_date',
              type: 'date',
              label: 'Notification of Acceptance Date',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
              },
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'contact_emails',
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
              name: 'contact_phones',
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
      ],
    },
    {
      name: 'start_date', // Mapped from startDate
      type: 'date',
      label: 'Start Date & Time',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'end_date', // Mapped from endDate
      type: 'date',
      label: 'End Date & Time',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    ...slugField(),
    {
      name: 'created_by',
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
      name: 'updated_by',
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
  trash: true,

  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
