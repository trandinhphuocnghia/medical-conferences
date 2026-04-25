import type { CollectionConfig } from 'payload'

import { adminOrOwner, anyone, authenticated } from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'

export const Files: CollectionConfig = {
  slug: 'files',
  access: {
    admin: authenticated,
    create: anyone,
    delete: adminOrOwner,
    read: anyone,
    update: adminOrOwner,
  },
  admin: {
    defaultColumns: ['filename', 'createdAt', 'updatedAt'],
    hidden: userView,
  },
  fields: [],
  upload: {
    disableLocalStorage: true,
    adapter: 'uploadthing',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ],
    bulkUpload: true,
    crop: true,
    displayPreview: true,
  },
  hooks: {},
}
