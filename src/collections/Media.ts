import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { adminOrOwner, anyone, authenticated } from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'
import { editorConfig } from '@/utilities/editorConfig'
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
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor(editorConfig),
    },
    ...author,
  ],
  upload: {
    adapter: 'uploadthing',
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
}
