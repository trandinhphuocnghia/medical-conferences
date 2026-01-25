import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import {
  BlocksFeature,
  defaultColors,
  FeatureProviderServer,
  FixedToolbarFeature,
  TextStateFeature,
} from '@payloadcms/richtext-lexical'

export const editorConfig = {
  features: ({ defaultFeatures }: { defaultFeatures: FeatureProviderServer[] }) => {
    return [
      ...defaultFeatures,
      TextStateFeature({
        state: {
          color: {
            ...defaultColors.text,
          },
          background: {
            ...defaultColors.background,
          },
        },
      }),
      BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
      FixedToolbarFeature(),
    ]
  },
}
