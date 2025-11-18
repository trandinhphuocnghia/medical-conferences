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

    mimeTypes: ['image/*', 'application/pdf'],
    crop: true,
    displayPreview: true,
  },
  hooks: {},
}

/*
{
  onChange,
  files = [],
}: {
  files: { url: string }[]
  onChange: (files: { url: string }[]) => void
}
*/
