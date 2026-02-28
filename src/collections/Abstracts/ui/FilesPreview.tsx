'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type PublicFile = {
  id: number | string
  filename: string
  url: string
  filesize?: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// ── Component ─────────────────────────────────────────────────────────────────
export const FilesPreview: React.FC = () => {
  const { initialData } = useDocumentInfo()
  const [files, setFiles] = useState<PublicFile[]>([])
  const [loading, setLoading] = useState(false)

  // `initialData.files` is array of IDs (numbers) or populated objects
  const rawFiles = (initialData as { files?: (number | PublicFile)[] } | undefined)?.files ?? []

  useEffect(() => {
    if (rawFiles.length === 0) {
      setFiles([])
      return
    }

    const ids: (number | string)[] = []
    const populated: PublicFile[] = []

    for (const v of rawFiles) {
      if (typeof v === 'object' && v !== null && 'url' in v) {
        populated.push(v as PublicFile)
      } else {
        ids.push(v as number | string)
      }
    }

    if (ids.length === 0) {
      setFiles(populated)
      return
    }

    // Fetch unpopulated IDs from the REST API
    setLoading(true)
    const query = ids.map((id) => `where[id][in][]=${id}`).join('&')
    fetch(`/api/public-files?${query}&limit=${ids.length}&depth=0`)
      .then((r) => r.json())
      .then((data) => setFiles([...populated, ...(data?.docs ?? [])]))
      .catch(() => setFiles(populated))
      .finally(() => setLoading(false))
  }, [rawFiles.length]) // re-run only when the count changes

  // Always render the container so the admin can see there's no file if empty
  return (
    <div
      style={{
        marginTop: '0.875rem',
        padding: '0.875rem 1rem',
        background: 'var(--theme-elevation-50, #f9fafb)',
        border: '1px solid var(--theme-elevation-150, #e5e7eb)',
        borderRadius: '6px',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--theme-elevation-500, #6b7280)',
          margin: '0 0 0.5rem',
        }}
      >
        📎 Attached Files
      </p>

      {loading ? (
        <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0 }}>Loading…</p>
      ) : files.length === 0 ? (
        <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, fontStyle: 'italic' }}>
          No files attached to this abstract.
        </p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
        >
          {files.map((file) => (
            <li
              key={file.id}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>📄</span>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.875rem',
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  wordBreak: 'break-all',
                  fontWeight: 500,
                }}
              >
                {file.filename}
              </a>
              {file.filesize ? (
                <span
                  style={{ fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0 }}
                >
                  ({formatBytes(file.filesize)})
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
