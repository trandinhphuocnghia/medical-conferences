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

import { bioLexical } from '@/fields/bioLexical'
import { author } from '@/utilities/collectionAuthor'
import { validateCongressDate } from './hooks/congressValidation'
import { afterToday, beforeValidateDate } from './hooks/validation'
import { detectDeadlineChanges } from './hooks/detectDeadlineChanges'

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
              name: 'venueCity',
              type: 'text',
              label: 'Venue City (Legacy)',
            },
            {
              name: 'venues',
              type: 'array',
              label: 'Venues',
              admin: {
                description: 'Add one or more venues for this conference.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Venue Name',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'City',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'address',
                  type: 'text',
                  label: 'Full Address',
                },
                {
                  name: 'note',
                  type: 'text',
                  label: 'Note (e.g., May 14th & 16th)',
                  admin: {
                    placeholder: 'May 14th & 16th',
                  },
                },
              ],
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
          label: 'Faculty & Program',
          fields: [
            {
              name: 'scientificBoard',
              label: 'Scientific Board (Poster Faculty)',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              admin: {
                description: 'Select the doctors who should explicitly appear on the Hero Section poster (dock). Note: You can only select users who are part of this conference\'s Host Organization.',
              },
              filterOptions: async ({ req, data }) => {
                if (data?.host) {
                  try {
                    // Fetch the host group to get its users
                    const group = await req.payload.findByID({
                      collection: 'user-groups',
                      id: typeof data.host === 'object' ? data.host.id : data.host,
                      depth: 0,
                    })

                    if (group && group.users && group.users.length > 0) {
                      return {
                        id: {
                          in: group.users.map((u: any) => (typeof u === 'object' ? u.id : u)),
                        },
                      }
                    }
                    
                    // If host has no users, return a condition that matches nothing
                    return { id: { equals: 0 } }
                  } catch (err) {
                    console.error('Error fetching host group in filterOptions:', err)
                  }
                }
                return true
              },
            },
            {
              name: 'programAgenda',
              type: 'array',
              label: 'Program Highlight (Hero Section)',
              admin: {
                description: 'Add the main sessions representing the event agenda shown on the top poster.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Session Title',
                  required: true,
                  admin: {
                    placeholder: 'e.g. ESD for Early Gastric Cancer',
                    width: '60%',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'speakerName',
                      type: 'text',
                      label: 'Speaker Name & Title',
                      admin: {
                        placeholder: 'e.g. Dr. Le Quang Nhan',
                        width: '50%',
                      },
                    },
                    {
                      name: 'isHighlight',
                      type: 'checkbox',
                      label: 'Is Broadcast/Highlight?',
                      defaultValue: false,
                      admin: {
                        width: '50%',
                        description: 'Styles this row as a broadcast or special group session.',
                      },
                    },
                  ],
                },
                {
                  name: 'organization',
                  type: 'text',
                  label: 'Organization / Hospital Note',
                  admin: {
                    condition: (_, siblingData) => Boolean(siblingData?.isHighlight),
                    placeholder: 'Organized by University Medical Center HCMC & FV Hospital',
                  },
                },
              ],
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
            // --- Highlight Metadata (Hidden from normal view, driven by hook) ---
            {
              type: 'collapsible',
              label: 'Deadline Highlight Settings',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'abstractDeadlineExtended',
                      type: 'checkbox',
                      label: 'Abstract Deadline Extended (Highlight)',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'notificationDateChanged',
                      type: 'checkbox',
                      label: 'Notification Date Changed (Highlight)',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'previousAbstractDeadline',
                      type: 'date',
                      label: 'Previous Abstract Deadline',
                      admin: { width: '50%', readOnly: true },
                    },
                    {
                      name: 'previousNotificationDate',
                      type: 'date',
                      label: 'Previous Notification Date',
                      admin: { width: '50%', readOnly: true },
                    },
                  ],
                },
              ],
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
        {
          label: 'Sponsors',
          fields: [
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'sponsors',
              hasMany: true,
              admin: {
                description: 'Select the sponsors for this conference.',
              },
            },
          ],
        },
        {
          label: 'Information',
          fields: [
            {
              name: 'informationSections',
              type: 'array',
              label: 'Information Sections',
              admin: {
                initCollapsed: true,
                description:
                  'Add content sections (e.g., For Participants, For Speakers, Accommodation, Transportation).',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Section Title',
                  admin: { placeholder: 'e.g., For Participants' },
                },
                {
                  name: 'description',
                  type: 'richText',
                  required: true,
                  editor: bioLexical,
                  label: 'Content',
                },
                {
                  name: 'attachments',
                  type: 'relationship',
                  relationTo: 'files',
                  hasMany: true,
                  label: 'Attachments (Documents)',
                  admin: {
                    description: 'Optional. Attach PDF, DOC, PPTX files for download.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Quick Facts',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'attendeesCount',
                  type: 'number',
                  label: 'Expected Attendees',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 500',
                  },
                },
                {
                  name: 'keynoteSpeakersCount',
                  type: 'number',
                  label: 'Keynote Speakers',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 14',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'durationOverride',
                  type: 'text',
                  label: 'Duration Override',
                  admin: {
                    width: '50%',
                    description: 'Override the automatic "X Days" calculation (e.g., "May 14-16").',
                  },
                },
                {
                  name: 'cmeCredits',
                  type: 'text',
                  label: 'CME Credits',
                  admin: {
                    width: '50%',
                    placeholder: 'e.g., 18 Hours',
                  },
                },
              ],
            },
          ],
        },
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
    beforeChange: [detectDeadlineChanges],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
