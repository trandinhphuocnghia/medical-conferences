import { SerializedListItemNode, SerializedListNode } from '@payloadcms/richtext-lexical'
import { JSXConverters } from '@payloadcms/richtext-lexical/react'

export const listConverter: JSXConverters<SerializedListNode | SerializedListItemNode> = {
  list: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({
      nodes: node.children,
    })

    if (node.listType === 'bullet') {
      return <ul className="list-disc ml-6 my-4">{text}</ul>
    }
    if (node.listType === 'number') {
      return <ol className="list-decimal ml-6 my-4">{text}</ol>
    }
    return <ul className="list-disc ml-6 my-4">{text}</ul>
  },

  listitem: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({ nodes: node.children })
    return <li>{text}</li>
  },
}
