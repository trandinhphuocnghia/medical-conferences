import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import { RICH_TEXT_DEFAULT_VALUES } from '@/constants/fields.constants'
import { slugField } from '@/fields/slug'
import { editorConfig } from '@/utilities/editorConfig'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
    topicList: true,
    likes: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'form', 'startDate', 'endDate', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'topicList',
              label: 'Topics',
              type: 'array',
              fields: [
                {
                  name: 'topic',
                  type: 'text',
                },
                {
                  name: 'content',
                  type: 'richText',
                  defaultValue: RICH_TEXT_DEFAULT_VALUES,
                  editor: lexicalEditor(editorConfig),
                  label: false,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
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
              // if the `generateUrl` function is configured
              hasGenerateFn: true,
              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    ...slugField(),
    {
      name: 'form',
      label: 'Abstract Form',
      type: 'relationship',
      relationTo: 'forms',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'likes',
      type: 'relationship',
      relationTo: 'likes',
      hasMany: true,
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

/*
export interface Conference {
    id: number; // PostgreSQL SERIAL PRIMARY KEY
    
    title: string; // E.g., "Korea International Gastric Cancer Week 2026"
    slug: string; // URL-friendly ID, e.g., "kingca-week-2026"
    theme: string; // E.g., "Shaping the Future of Gastric Cancer Treatment"

    // Timing and Location : Required.
    start_date: Date; // TIMESTAMP WITH TIME ZONE
    end_date: Date;   // TIMESTAMP WITH TIME ZONE
    venue_name: string; // E.g., "Lotte Hotel Seoul"
    venue_city: string; 

    // Organization and Status: Required.
    host_organization: string; <- related to groupUser-id, select grouped.
    is_active: boolean; // True if the conference is live/visible
    
    // Key Deadlines (Critical for Abstracts)
    abstract_submission_deadline: Date;
    early_registration_deadline: Date;
    notification_of_acceptance_date: Date;
    
    // Secretariat / Contact Information
    contact_emails: string[]; -> required.
    contact_phones: string[]; -> required.

    // Audit Fields
    created_at: Date;
    updated_at: Date;

    // Relationships (Virtual or Foreign Keys managed by Payload)
    topics?: Topic[];
}

export interface Session {
    id: number;
    conference_id: number; // Foreign Key to link back to the parent conference

    // Content Metadata
    title: string; // E.g., "Symposium 1: ERAS in Gastric Cancer Surgery"
    session_type: 'plenary' | 'symposium' | 'lecture' | 'oral_presentation' | 'masterclass';
    
    // Scheduling
    date: Date;
    start_time: string; // E.g., "09:00"
    end_time: string;   // E.g., "10:30"
    room_location: string; // E.g., "Crystal Ballroom 1"

    // Relationships (Speakers, Chairs, etc.)
    chairs?: User[]; // Users responsible for running the session
    speakers?: User[]; // Users presenting in the session
    topics?: Topic[]; // Topics presented during the session

    // Audit Fields
    created_at: Date;
    updated_at: Date;
}


export interface TopicCategory {
  id: number
  
  name: string // E.g., "Translational Research & Biomarkers"
  description: string | null
  is_active: boolean
  sort_order: number

}

export interface Topic {
    id: number;
    category_ids: string[]; 
    name: string; // E.g., "AI in Endoscopy" or "PIPAC Protocols"
    description: string | null
    is_active: boolean;
}
*/
