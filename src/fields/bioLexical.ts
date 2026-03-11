import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

export const bioLexical = lexicalEditor({
  features: [
    UnorderedListFeature(),
    OrderedListFeature(),
    IndentFeature(),
    HorizontalRuleFeature(),
    EXPERIMENTAL_TableFeature(),
    FixedToolbarFeature(),
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
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
