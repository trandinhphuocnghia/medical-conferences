import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  adminOrModifier,
  adminOrOwner,
  anyone,
  authenticated,
} from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'
import { editorConfig } from '@/utilities/editorConfig'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Files: CollectionConfig = {
  slug: 'files',
  access: {
    admin: authenticated,
    create: adminOrModifier,
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
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor(editorConfig),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*', 'application/pdf'],
    crop: true,
    displayPreview: true,
  },
  hooks: {
    // beforeOperation: [
    //   ({ req, operation }) => {
    //     if ((operation === 'create' || operation === 'update') && req.file) {
    //       console.log({ file: req.file })
    //       //req.file.name = 'test.jpg'
    //     }
    //   },
    // ],
  },
}
