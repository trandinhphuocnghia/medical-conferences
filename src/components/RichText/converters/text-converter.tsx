import { SerializedTextNode } from '@payloadcms/richtext-lexical'
import { defaultColors as defaultColorsOfPayload } from '@payloadcms/richtext-lexical/client'
import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import type { TextStateFeatureProps } from 'node_modules/@payloadcms/richtext-lexical/dist/features/textState/feature.server'
import { CSSProperties } from 'react'
import { defaultColors } from './default-colors'

const colorState: TextStateFeatureProps['state'] = {
  color: {
    ...defaultColorsOfPayload.text,
    ...defaultColors.text,
  },

  size: {
    large: {
      label: 'Large Text',
      css: {
        'font-size': 'large',
      },
    },
  },
  background: {
    ...defaultColorsOfPayload.background,
    ...defaultColors.background,
  },
  underline: {
    solid: {
      label: 'Solid',
      css: {
        'text-decoration': 'underline',
        'text-underline-offset': '4px',
      },
    },
    dashed: {
      label: 'Dashed',
      css: {
        'text-decoration': 'underline dashed',
        'text-underline-offset': '4px',
      },
    },
    'red-line-through': {
      label: 'Red Line Through',
      css: {
        'text-decoration': 'line-through',
        'text-decoration-style': 'dotted',
        'text-decoration-color': 'red',
      },
    },
  },
  fontWeight: {
    bolder: {
      label: 'Bolder',
      css: {
        'font-weight': 'bolder',
      },
    },
  },
}

const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

export const extractCustomStyles = (node: SerializedTextNode): CSSProperties => {
  const styles: CSSProperties = {}

  if (!node.$) {
    return styles
  }

  Object.entries(colorState).forEach(([stateGroupKey, stateGroupValues]) => {
    if (!node.$) {
      return
    }

    const styleVariantKey = node?.$[stateGroupKey] as string

    if (styleVariantKey) {
      const styleDefinition = stateGroupValues[styleVariantKey]

      if (styleDefinition && styleDefinition.css) {
        Object.assign(styles, styleDefinition.css)
      } else {
        console.warn(
          `Could not find style definition for group '${stateGroupKey}' with key: ${styleVariantKey}`,
        )
      }
    }
  })

  return styles
}

export const textConverter: JSXConverters<SerializedTextNode> = {
  text: ({ node }) => {
    const styles = extractCustomStyles(node)

    let text: React.ReactNode = node.text
    if (node.format & IS_BOLD) {
      text = <strong style={styles}>{text}</strong>
    }
    if (node.format & IS_ITALIC) {
      text = <em style={styles}>{text}</em>
    }
    if (node.format & IS_STRIKETHROUGH) {
      text = <span style={{ ...styles, textDecoration: 'line-through' }}>{text}</span>
    }
    if (node.format & IS_UNDERLINE) {
      text = <span style={{ ...styles, textDecoration: 'underline' }}>{text}</span>
    }
    if (node.format & IS_CODE) {
      text = <code style={styles}>{text}</code>
    }
    if (node.format & IS_SUBSCRIPT) {
      text = <sub style={styles}>{text}</sub>
    }
    if (node.format & IS_SUPERSCRIPT) {
      text = <sup style={styles}>{text}</sup>
    }
    if (node.$) {
      text = <span style={styles}>{text}</span>
    }
    return text
  },
}
