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
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
    displayPreview: true,
    disableLocalStorage: true,
  },
}
