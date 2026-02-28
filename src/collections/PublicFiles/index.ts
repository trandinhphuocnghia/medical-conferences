import { authenticated } from '@/access/collectionAccess'
import type { CollectionConfig } from 'payload'

/**
 * public-files
 *
 * Tracks metadata for files uploaded client-side via the Uploadthing SDK.
 * The browser uploads directly to Uploadthing; only the resulting metadata
 * (url, key, filename …) is persisted here.
 *
 * Relationship model:
 *   public-files.abstract → abstracts   (many-to-one)
 *   public-files.uploadedBy → users     (optional — null for anonymous)
 *
 * Orphan cleanup:
 *   A cron job should delete docs where `abstract IS NULL` and
 *   `createdAt < (now - 24h)` — and call the Uploadthing delete API
 *   using the stored `key` before removing the DB row.
 */
export const PublicFiles: CollectionConfig = {
  slug: 'public-files',

  access: {
    admin: authenticated,
    // Anyone can upload (anonymous abstract submissions are allowed)
    create: () => true,
    // Owner or admin can read; restrict in production as needed
    read: () => true,
    // Immutable after creation — only admins can update metadata
    update: authenticated,
    // Only admins can hard-delete (cron job uses local admin key)
    delete: authenticated,
  },

  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'abstract', 'uploadedBy', 'createdAt'],
    description: 'Files uploaded client-side for abstract submissions.',
  },

  timestamps: true,

  fields: [
    // ── Storage metadata (set by the client after Uploadthing responds) ──
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Public CDN URL returned by Uploadthing.',
        readOnly: true,
      },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Uploadthing file key — required for deletion.',
        readOnly: true,
      },
    },
    {
      name: 'filename',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'mimeType',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'filesize',
      type: 'number',
      admin: {
        description: 'File size in bytes.',
        readOnly: true,
      },
    },

    // ── Ownership ─────────────────────────────────────────────────────────
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false, // null for anonymous submitters
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Populated when the uploader had an active session.',
        readOnly: true,
      },
      access: {
        update: () => false,
      },
    },

    // ── Link to abstract (set after form submission) ──────────────────────
    {
      name: 'abstract',
      type: 'relationship',
      relationTo: 'abstracts',
      required: false, // null until the abstract form is successfully submitted
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Linked once the abstract form is submitted. Files without an abstract are considered orphans and eligible for cleanup.',
      },
    },
  ],

  hooks: {
    // TODO: beforeDelete hook — call Uploadthing delete API using `key`
    // before the row is removed from the DB.
  },
}
