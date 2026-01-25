import { Media } from '@/payload-types'
import { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

export const uploadConverter: JSXConverters<SerializedUploadNode> = {
  upload: ({ node }) => {
    const media = node.value as Media | undefined

    if (!media || !media.url) {
      return (
        <div className="text-red-500 border border-red-500 p-2 my-4 bg-red-50 dark:bg-red-950 dark:text-red-300 rounded-lg">
          [Error: Media asset not found or URL missing for ID: {media?.id || 'N/A'}]
        </div>
      )
    }

    const { url, filename, alt, mimeType, width = 0, height } = media
    const isImage = mimeType?.startsWith('image/')

    if (isImage) {
      return (
        <Image
          src={url}
          alt={alt || filename || 'Uploaded media'}
          width={width || 0}
          height={height || 0}
          className="aspect-auto max-w-full h-auto"
        />
      )
    }

    // Handle other file types (e.g., PDFs, documents)
    return (
      <div className="my-4 p-4 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-400 underline shrink-0 transition-colors"
        >
          Download
        </a>
      </div>
    )
  },
}
