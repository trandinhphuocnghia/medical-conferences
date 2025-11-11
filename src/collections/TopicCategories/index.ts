import type { CollectionConfig } from 'payload'

import { setCurrentInteract } from '@/hooks/getCurrentInteract'
import { authenticated } from '../../access/authenticated'

export const TopicCategories: CollectionConfig = {
  slug: 'topic-categories',
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
    defaultColumns: ['name', 'sort_order', 'is_active', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    // 1. NAME FIELD (Configured for Global Uniqueness and Indexing)
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
      admin: {
        // FIX: Description updated to Category context
        description: 'E.g., "Surgical Oncology" or "Translational Research". Must be unique.',
      },
      unique: true,
      index: true,
    },

    // 2. DESCRIPTION FIELD
    {
      name: 'description',
      type: 'textarea',
      label: 'Category Description (Optional)',
    },

    // 3. IS_ACTIVE (Soft Delete)
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Is Category Active?', // FIX: Label changed to Category
      defaultValue: true,
      admin: {
        description: 'Unchecking this soft-deletes the category (hides it from the frontend).',
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
  ],
  timestamps: true,
}
