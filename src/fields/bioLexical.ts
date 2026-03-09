import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

export const bioLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
    }),
    UploadFeature({
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'richText',
              editor: lexicalEditor({
                features: [ParagraphFeature(), BoldFeature(), ItalicFeature()],
              }),
            },
          ],
        },
      },
    }),
  ],
})
