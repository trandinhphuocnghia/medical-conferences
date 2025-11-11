import type { CollectionConfig } from 'payload'

import { RICH_TEXT_DEFAULT_VALUES } from '@/constants/fields.constants'
import { setCurrentInteract } from '@/hooks/getCurrentInteract'
import { editorConfig } from '@/utilities/editorConfig'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { authenticated } from '../../access/authenticated'

export const Topics: CollectionConfig = {
  slug: 'topics',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  hooks: {
    beforeChange: [setCurrentInteract],
  },
  admin: {
    defaultColumns: ['name'],
    useAsTitle: 'name',
  },
  fields: [
    //1. Name:
    {
      //config:
      name: 'name',
      type: 'text',
      required: true,
      label: 'Topic Name',
      //access:
      admin: {
        description:
          'E.g., "AI in Endoscopy" or "PIPAC Protocols". Must be unique within the Parent Category.',
      },
      //optimize:
      unique: true,
      index: true,
    },

    //2. description:
    {
      name: 'description',
      type: 'textarea',
      label: 'Topic Description (Optional)',
    },

    //3. content
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({ ...editorConfig }),
      defaultValue: RICH_TEXT_DEFAULT_VALUES,
    },

    //3. is_active:
    //soft deletion.
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Is Topic Active?',
      defaultValue: true,
      admin: {
        description: 'Unchecking this soft-deletes the topic (hides it from the frontend).',
        // NOTE: Custom confirmation modals must be built using custom React components,
        // they cannot be configured here with a simple property.
      },
    },

    //4. created_by & updated_by:
    //data trace off.
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Created By Admin',
      admin: {
        readOnly: true, // Make sure admins can't manually change this
        position: 'sidebar',
      },
      // Restrict options to only include users with the 'admin' role
      filterOptions: () => {
        return {
          roles: {
            in: ['admin'],
          },
        }
      },
    },
    {
      name: 'updated_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Last Modified By',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    /* ----RELATIONSHIP---- */
    //1. category
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'topic-categories',
      required: true,
      index: true,
      label: 'Parent Category',
    },
  ],
  timestamps: true,
}
