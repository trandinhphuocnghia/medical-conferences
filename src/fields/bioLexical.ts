import {
  AlignFeature,
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SuperscriptFeature,
  SubscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

export const bioLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    AlignFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SuperscriptFeature(),
    SubscriptFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    EXPERIMENTAL_TableFeature(),
    HorizontalRuleFeature(),
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
