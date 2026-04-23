'use client'

import { Media } from '@/payload-types'
import Image from 'next/image'
import React, { Fragment } from 'react'

type Node = {
  type: string
  version: number
  [key: string]: any
}

export const RichTextParser = ({ content }: { content: any }) => {
  if (!content?.root?.children) {
    return null
  }

  return <Serialize nodes={content.root.children} />
}

const Serialize = ({ nodes }: { nodes: Node[] }) => {
  return (
    <Fragment>
      {nodes?.map((node, i) => {
        if (!node) {
          return null
        }

        if (TextNode(node)) {
          let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />
          if (node.format & 1) {
            text = <strong>{text}</strong>
          }
          if (node.format & 2) {
            text = <em>{text}</em>
          }
          if (node.format & 8) {
            text = <u>{text}</u>
          }
          // code
          if (node.format & 16) {
            text = <code>{text}</code>
          }

          return <React.Fragment key={i}>{text}</React.Fragment>
        }

        switch (node.type) {
          case 'heading':
            const HeadingTag = (node.tag || 'h2') as React.ElementType
            return (
              <HeadingTag
                key={i}
                className="font-semibold text-slate-800 my-4"
                style={node.indent ? { paddingInlineStart: `${node.indent * 2}rem` } : {}}
              >
                <Serialize nodes={node.children} />
              </HeadingTag>
            )
          case 'paragraph':
            return (
              <p
                key={i}
                className="mb-4 leading-relaxed text-slate-600"
                style={node.indent ? { paddingInlineStart: `${node.indent * 2}rem` } : {}}
              >
                <Serialize nodes={node.children} />
              </p>
            )
          case 'list':
            const ListTag = (node.tag || 'ul') as React.ElementType
            return (
              <ListTag
                key={i}
                className={`mb-4 pl-6 ${node.tag === 'ol' ? 'list-decimal' : 'list-disc'}`}
                style={node.indent ? { paddingInlineStart: `${node.indent * 2}rem` } : {}}
              >
                <Serialize nodes={node.children} />
              </ListTag>
            )
          case 'listitem':
            return (
              <li key={i}>
                <Serialize nodes={node.children} />
              </li>
            )
          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-4 border-cyan-500 pl-4 italic text-slate-600 my-4"
              >
                <Serialize nodes={node.children} />
              </blockquote>
            )
          case 'link':
            return (
              <a
                key={i}
                href={node.fields?.url || '#'}
                target='_blank'
                rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
                className="text-cyan-600 hover:underline"
              >
                <Serialize nodes={node.children} />
              </a>
            )
          case 'upload':
            const media = node.value as Media
            if (!media?.url) return null

            return (
              <div key={i} className="my-6 w-fit rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={media.url}
                  alt={media?.alt || 'Content image'}
                  width={media?.width || 0}
                  height={media?.height || 0}
                />
                {node.fields?.caption && (
                  <div className="text-center text-sm text-slate-500 mt-2 italic">
                    {/* Recursively render rich text caption if structure matches, otherwise simple render */}
                    {/* Caption is usually a rich text editorState, so we might need another Serialize if complex */}
                  </div>
                )}
              </div>
            )

          case 'table':
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                  <tbody>
                    <Serialize nodes={node.children} />
                  </tbody>
                </table>
              </div>
            )
          case 'tablerow':
            return (
              <tr key={i} className="border-b border-slate-200 last:border-b-0">
                <Serialize nodes={node.children} />
              </tr>
            )
          case 'tablecell':
            const CellTag = node.headerState ? 'th' : 'td'
            return (
              <CellTag
                key={i}
                colSpan={node.colSpan || 1}
                rowSpan={node.rowSpan || 1}
                className={`px-4 py-2.5 text-left border-r border-slate-200 last:border-r-0 ${node.headerState ? 'bg-slate-50 font-semibold text-slate-800' : 'text-slate-600'
                  }`}
              >
                <Serialize nodes={node.children} />
              </CellTag>
            )
          case 'horizontalrule':
            return <hr key={i} className="my-8 border-t border-slate-200" />

          default:
            return (
              <div key={i}>
                {/* Fallback for unknown nodes, try to render children */}
                {node.children && <Serialize nodes={node.children} />}
              </div>
            )
        }
      })}
    </Fragment>
  )
}

// Check if node is a text node
const TextNode = (node: Node): node is Node & { text: string; format: number } => {
  return node.type === 'text' && typeof node.text === 'string'
}

// Escape HTML entities to prevent XSS in text content
const escapeHTML = (str: string) =>
  str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[tag] || tag,
  )
