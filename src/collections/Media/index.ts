import type { CollectionConfig } from 'payload'

import { adminOrOwner, anyone, authenticated } from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'
import { author } from '@/utilities/collectionAuthor'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: adminOrOwner,
    read: anyone,
    update: adminOrOwner,
  },
  admin: {
    hidden: userView,
    defaultColumns: ['filename', 'createdAt', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    ...author,
  ],
  upload: {
    adapter: 'uploadthing',
    disableLocalStorage: true,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
    displayPreview: true,

    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'preview',
        width: 1024,
        // height is auto-calculated if omitted to maintain aspect ratio
      },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
}
