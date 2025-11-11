import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  labels: {
    plural: 'Conferences',
    singular: 'Conferences',
  },

  // --- ACCESS ---
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished, // Allows published content to be read publicly
    update: authenticated,
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

    // 3. IS_ACTIVE (Status Field)
    {
      //-> [WORKS]: Cron-job to auto mark as active ?
      name: 'is_active',
      type: 'checkbox',
      label: 'Is Conference Active/Live?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Set to True when the conference program and registration are public.',
      },
      required: true,
    },

    // 4. HOST ORGANIZATION
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
        // Optional: Filter to only select users with the 'admin' role
      },
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Timing & Content',
          fields: [
            // 5. VENUE FIELDS (Required Location)
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

            // 6. TOPICS (Linking to Categories/Topics, assuming the topics_list relationship from AbstractCategories)
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

        // 7. DEADLINES TAB (Critical Dates)
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

        // 8. CONTACTS TAB (Secretariat Information)
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

        // 9. SEO & RELATED CONTENT TABS (Existing Tabs Retained)
        {
          label: 'SEO & Related',
          fields: [
            // Existing related Conferences field (Moved from Meta tab)
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
            // Existing SEO fields
            // {
            //   name: 'meta',
            //   label: 'SEO',
            //   type: '',
            //   fields: [
            //     OverviewField({
            //       titlePath: 'meta.title',
            //       descriptionPath: 'meta.description',
            //       imagePath: 'meta.image',
            //     }),
            //     MetaTitleField({
            //       hasGenerateFn: true,
            //     }),
            //     MetaImageField({
            //       relationTo: 'media',
            //     }),
            //     MetaDescriptionField({}),
            //     PreviewField({
            //       // if the `generateUrl` function is configured
            //       hasGenerateFn: true,
            //       // field paths to match the target field for data
            //       titlePath: 'meta.title',
            //       descriptionPath: 'meta.description',
            //     }),
            //   ],
            // },
          ],
        },
      ],
    },

    // 10. TIMING FIELDS (Replaced with Schema names)
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

    // 11. SLUG FIELD (Retained)
    ...slugField(),
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
