import { Category, Media, Topic, UserGroup } from '@/payload-types'

// Helper type guards
export function isUserGroup(host: number | UserGroup): host is UserGroup {
  return typeof host === 'object' && host !== null && 'name' in host
}

export function isTopic(topic: number | Topic): topic is Topic {
  return typeof topic === 'object' && topic !== null && 'name' in topic
}

export function isCategory(category: number | Category): category is Category {
  return typeof category === 'object' && category !== null && 'name' in category
}

export function isMedia(media: number | null | Media): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

// Helper to extract text from Payload rich text content
export function extractTextFromContent(content: Topic['content']): string {
  if (!content?.root?.children) return ''

  const extractText = (node: unknown): string => {
    if (typeof node !== 'object' || node === null) return ''

    const n = node as Record<string, unknown>

    console.log(content)

    if (n.type === 'upload') {
      return '' // Skip images for text extraction
    }

    if (n.text && typeof n.text === 'string') {
      return n.text
    }

    if (Array.isArray(n.children)) {
      return n.children.map(extractText).join(' ')
    }

    return ''
  }

  return content.root.children.map(extractText).join('\n\n').trim()
}
