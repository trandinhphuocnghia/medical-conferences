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
    hidden: userView,
  },
  fields: [],
  upload: {
    disableLocalStorage: true,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ],
    bulkUpload: true,
    crop: true,
    displayPreview: true,
  },
  hooks: {},
}
