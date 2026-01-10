// components/FilePreview.tsx
'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

type FilePreviewProps = {
  path: string
}

export const FilePreview: React.FC<FilePreviewProps> = ({ path }) => {
  const siblingPath = path.replace('preview', 'url')

  const urlValue = useFormFields(([fields]) => {
    return fields[siblingPath]?.value as string | undefined
  })

  if (!urlValue) {
    return (
      <div
        style={{
          padding: '10px',
          fontSize: '12px',
          color: '#999',
          fontStyle: 'italic',
        }}
      >
        No URL provided for preview.
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: '#f5f5f5',
          padding: '5px 10px',
          fontSize: '11px',
          borderBottom: '1px solid #ddd',
        }}
      >
        Direct Preview: {urlValue}
      </div>
    </div>
  )
}
