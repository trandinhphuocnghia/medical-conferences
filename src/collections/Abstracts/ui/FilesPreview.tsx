'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type PublicFile = {
  id: number | string
  filename: string
  url: string
  mimeType?: string
  filesize?: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function isImage(file: PublicFile): boolean {
  if (file.mimeType) return file.mimeType.startsWith('image/')
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(file.filename)
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
  }, [rawFiles]) // re-run when the files array object changes

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
            gap: '0.625rem',
          }}
        >
          {files.map((file) => (
            <li
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--theme-elevation-100, #f0f0f0)',
              }}
            >
              {/* Thumbnail or icon */}
              {isImage(file) ? (
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={file.url}
                    alt={file.filename}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid var(--theme-elevation-150, #e5e7eb)',
                      flexShrink: 0,
                    }}
                  />
                </a>
              ) : (
                <span style={{ fontSize: '1.5rem', flexShrink: 0, lineHeight: 1 }}>📄</span>
              )}

              {/* File info */}
              <div style={{ flex: 1, minWidth: 0 }}>
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
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.125rem',
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                  }}
                >
                  {file.mimeType && <span>{file.mimeType}</span>}
                  {file.filesize ? <span>{formatBytes(file.filesize)}</span> : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
