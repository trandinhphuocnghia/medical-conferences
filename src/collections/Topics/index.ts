import type { CollectionConfig } from 'payload'

import {
  adminOrModifier,
  adminOrOwner,
  anyone,
  authenticated,
} from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'
import { RICH_TEXT_DEFAULT_VALUES } from '@/constants/fields.const'
import { setCurrentInteract } from '@/hooks/getCurrentInteract'
import { editorConfig } from '@/utilities/editorConfig'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { author } from '@/utilities/collectionAuthor'

export const Topics: CollectionConfig = {
  slug: 'topics',
  access: {
    admin: authenticated,
    create: adminOrModifier,
    delete: adminOrOwner,
    read: anyone,
    update: adminOrOwner,
  },
  hooks: {
    beforeChange: [setCurrentInteract],
  },
  admin: {
    defaultColumns: ['name', 'active', 'category', 'createdBy', 'updatedAt'],
    useAsTitle: 'name',
    hidden: userView,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Topic Name',
      admin: {
        description:
          'E.g., "AI in Endoscopy" or "PIPAC Protocols". Must be unique within the Parent Category.',
      },
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Topic Description (Optional)',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({ ...editorConfig }),
      defaultValue: RICH_TEXT_DEFAULT_VALUES,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
      label: 'Category',
      admin: {
        position: 'sidebar',
      },
    },
    ...author,
  ],
  timestamps: true,
}
