'use client'

import { Media } from '@/payload-types'
import Image from 'next/image'
import React, { Fragment } from 'react'

type Node = {
  type: string
  version: number
  [key: string]: any
}

// Security: Sanitize URL to prevent XSS attacks via href attributes
const sanitizeUrl = (url?: string) => {
  if (!url) return '#'

  const sanitized = url.trim().toLowerCase()
  // Block script execution via URL
  if (sanitized.startsWith('javascript:') || sanitized.startsWith('data:text/html')) {
    return '#'
  }
  return url
}

// 1. Extract Text Node logic into a separate, clean function
const renderTextNode = (node: Node, key: number) => {
  // Use whitespace-pre-wrap to preserve line breaks naturally
  let text: React.ReactNode = <span className="whitespace-pre-wrap">{node.text}</span>

  if (node.format & 1) text = <strong>{text}</strong>
  if (node.format & 2) text = <em>{text}</em>
  if (node.format & 8) text = <u>{text}</u>
  if (node.format & 16) text = <code>{text}</code>

  return <React.Fragment key={key}>{text}</React.Fragment>
}

// 2. CREATE A DICTIONARY OF RENDERERS (Object Mapping Pattern)
// Key is `node.type`, Value is a function returning a ReactNode
const NodeRenderers: Record<string, (props: { node: Node; index: number; children: React.ReactNode }) => React.ReactNode> = {
  heading: ({ node, index, children }) => {
    const HeadingTag = (node.tag || 'h2') as React.ElementType
    // Use text-h2 or text-h3 classes instead of hardcoding static sizes and colors
    return (
      <HeadingTag
        key={index}
        className={`${node.tag === 'h1' ? 'text-h1' : 'text-h2'} my-6 text-foreground`}
        style={node.indent ? { paddingInlineStart: `${node.indent * 2}rem` } : {}}
      >
        {children}
      </HeadingTag>
    )
  },

  paragraph: ({ node, index, children }) => (
    // Sync with text-body and muted-foreground color for optimal readability
    <p
      key={index}
      className="text-body mb-4 text-foreground/80"
      style={node.indent ? { paddingInlineStart: `${node.indent * 2}rem` } : {}}
    >
      {children}
    </p>
  ),

  list: ({ node, index, children }) => {
    const ListTag = (node.tag || 'ul') as React.ElementType
    return (
      <ListTag
        key={index}
        className={`text-body mb-4 pl-6 text-foreground/80 ${node.tag === 'ol' ? 'list-decimal' : 'list-disc'}`}
        style={node.indent ? { paddingInlineStart: `${node.indent * 2}rem` } : {}}
      >
        {children}
      </ListTag>
    )
  },

  listitem: ({ index, children }) => <li key={index} className="mb-1">{children}</li>,

  quote: ({ index, children }) => (
    // Change border-cyan-500 to border-primary to support Dark/Light mode
    <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
      {children}
    </blockquote>
  ),

  link: ({ node, index, children }) => {
    const isNewTab = node.fields?.newTab
    return (
      <a
        key={index}
        href={sanitizeUrl(node.fields?.url)}
        target={isNewTab ? '_blank' : '_self'}
        rel={isNewTab ? 'noopener noreferrer' : undefined}
        // Use text-primary to keep links prominent and aligned with the medical tone
        className="text-primary font-medium hover:underline underline-offset-4"
      >
        {children}
      </a>
    )
  },

  upload: ({ node, index }) => {
    const media = node.value as Media
    if (!media?.url) return null
    return (
      <div key={index} className="my-8 w-fit rounded-xl overflow-hidden shadow-sm border border-border">
        <Image src={media.url} alt={media?.alt || 'Content image'} width={media?.width || 800} height={media?.height || 400} className="object-cover" />
      </div>
    )
  },

  table: ({ index, children }) => (
    <div key={index} className="my-8 overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full border-collapse text-sm">
        <tbody>{children}</tbody>
      </table>
    </div>
  ),

  tablerow: ({ index, children }) => (
    <tr key={index} className="border-b border-border last:border-b-0">
      {children}
    </tr>
  ),

  tablecell: ({ node, index, children }) => {
    const CellTag = node.headerState ? 'th' : 'td'
    return (
      <CellTag
        key={index}
        colSpan={node.colSpan || 1}
        rowSpan={node.rowSpan || 1}
        className={`px-4 py-3 text-left border-r border-border last:border-r-0 ${node.headerState ? 'bg-muted/50 font-semibold text-foreground' : 'text-foreground/80'
          }`}
      >
        {children}
      </CellTag>
    )
  },

  horizontalrule: ({ index }) => <hr key={index} className="my-8 border-t border-border" />
}

// 3. THE MAIN SERIALIZE FUNCTION (Now highly concise)
const Serialize = ({ nodes }: { nodes: Node[] }) => {
  return (
    <Fragment>
      {nodes?.map((node, i) => {
        if (!node) return null

        // Handle native Text Nodes explicitly
        if (node.type === 'text' && typeof node.text === 'string') {
          return renderTextNode(node, i)
        }

        // Recursively render children if they exist
        const mappedChildren = node.children ? <Serialize nodes={node.children} /> : null

        // Retrieve the appropriate renderer from the dictionary
        const Renderer = NodeRenderers[node.type]

        // If a renderer exists, apply it. Otherwise, use a fallback wrapper.
        if (Renderer) {
          return Renderer({ node, index: i, children: mappedChildren })
        }

        return <div key={i}>{mappedChildren}</div>
      })}
    </Fragment>
  )
}

export const RichTextParser = ({ content }: { content: any }) => {
  if (!content?.root?.children) return null
  return <Serialize nodes={content.root.children} />
}