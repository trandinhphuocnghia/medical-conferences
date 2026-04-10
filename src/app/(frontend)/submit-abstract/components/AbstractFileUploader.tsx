'use client'

import { useUploadThing } from '@/lib/uploadthing'
import { useRef, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
export type UploadedFileData = {
  url: string
  key: string
  name: string
  /** publicFileId returned by the server's onUploadComplete callback */
  publicFileId?: string
}

type Props = {
  /** Called whenever the list of uploaded files changes. */
  onFilesChange: (files: UploadedFileData[]) => void
  /** Called whenever the uploading state changes — lets the parent block navigation. */
  onUploadStateChange?: (isUploading: boolean) => void
  /**
   * Optional Cloudflare Turnstile (or any CAPTCHA) token.
   * Forwarded as `x-turnstile-token` request header for middleware validation.
   */
  captchaToken?: string
}

const MAX_FILES = 5
const ACCEPTED_TYPES = '.pdf,.png,.jpg,.jpeg,.webp'

// ── Component ─────────────────────────────────────────────────────────────────
export function AbstractFileUploader({
  onFilesChange,
  onUploadStateChange,
  captchaToken,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([])

  const { startUpload } = useUploadThing('abstractFileUploader', {
    headers: captchaToken ? { 'x-turnstile-token': captchaToken } : undefined,

    onUploadBegin() {
      setIsUploading(true)
      onUploadStateChange?.(true)
      setUploadError(null)
      setProgress(0)
    },

    onUploadProgress(p) {
      setProgress(p)
    },

    onClientUploadComplete(res) {
      setIsUploading(false)
      onUploadStateChange?.(false)
      setProgress(100)
      if (!res || res.length === 0) return

      const newFiles: UploadedFileData[] = res.map((file) => ({
        url: file.url,
        key: file.key,
        name: file.name,
        publicFileId: (file.serverData as { publicFileId?: string } | null)?.publicFileId,
      }))

      setUploadedFiles((prev) => {
        const updated = [...prev, ...newFiles].slice(0, MAX_FILES)
        onFilesChange(updated)
        return updated
      })
    },

    onUploadError(error) {
      setIsUploading(false)
      onUploadStateChange?.(false)
      setProgress(0)

      const message = error?.message ?? ''
      const isRateLimit =
        message.toLowerCase().includes('rate limit') ||
        message.toLowerCase().includes('too fast') ||
        (error as { cause?: string })?.cause === 'RATE_LIMIT_ERROR'

      setUploadError(
        isRateLimit
          ? '⏱️ You are uploading too fast. Please wait a minute before trying again.'
          : message || 'Upload failed. Please try again.',
      )
    },
  })

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''

    const slotsLeft = MAX_FILES - uploadedFiles.length
    if (slotsLeft <= 0) {
      setUploadError(`Maximum ${MAX_FILES} files allowed.`)
      return
    }

    const filesToUpload = files.slice(0, slotsLeft)
    startUpload(filesToUpload)
  }

  const handleRemove = (index: number) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      onFilesChange(updated)
      return updated
    })
  }

  const canAddMore = uploadedFiles.length < MAX_FILES

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* ── Uploaded Files List ──────────────────────────────────────────── */}
      {uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.875rem' }}>
          {uploadedFiles.map((file, i) => (
            <div
              key={file.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.625rem 0.875rem',
                background: 'oklch(0.97 0.03 145)',
                border: '1.5px solid oklch(0.72 0.18 145)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                color: 'oklch(0.30 0.12 145)',
              }}
            >
              <span style={{ fontSize: '0.875rem', flexShrink: 0 }}>
                {file.name.match(/\.(png|jpe?g|webp)$/i) ? '🖼️' : '📄'}
              </span>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontWeight: 500,
                  color: 'oklch(0.30 0.12 145)',
                  textDecoration: 'underline',
                  wordBreak: 'break-all',
                  fontSize: '0.8125rem',
                }}
              >
                {file.name}
              </a>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--destructive)',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  lineHeight: 1,
                  padding: '0 0.25rem',
                  flexShrink: 0,
                }}
                title="Remove file"
              >
                ×
              </button>
            </div>
          ))}
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>
            {uploadedFiles.length} / {MAX_FILES} files uploaded
          </p>
        </div>
      )}

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {uploadError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            marginBottom: '0.875rem',
            background: 'oklch(0.97 0.02 20)',
            border: '1.5px solid var(--destructive)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            color: 'var(--destructive)',
          }}
        >
          <span>⚠️</span>
          <span>{uploadError}</span>
        </div>
      )}

      {/* ── Drop / Select zone (visible when more files can be added) ────── */}
      {canAddMore && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isUploading) inputRef.current?.click()
          }}
          style={{
            border: `1.5px dashed ${isUploading ? 'var(--cyan)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            background: isUploading ? 'oklch(0.97 0.04 195 / 0.4)' : 'var(--background)',
            cursor: isUploading ? 'wait' : 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: '0.25rem' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          {/* Label */}
          <p
            style={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'var(--foreground)',
              margin: 0,
            }}
          >
            {isUploading ? 'Uploading…' : 'Drag & drop your files here'}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: 0 }}>
            PDF or images (PNG, JPG, WebP) · max 8 MB each · up to {MAX_FILES} files
          </p>

          {/* ── Progress bar (visible while uploading) ─────────────────────── */}
          {isUploading && (
            <div style={{ width: '100%', marginTop: '0.75rem' }}>
              <div
                style={{
                  height: 6,
                  background: 'var(--border)',
                  borderRadius: 99,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--navy), var(--cyan))',
                    borderRadius: 99,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--cyan)', margin: '0.375rem 0 0' }}>
                {progress}% uploaded
              </p>
            </div>
          )}

          {/* ── Choose file button (visible when idle) ─────────────────────── */}
          {!isUploading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
              style={{
                background: 'var(--navy)',
                color: 'var(--primary-foreground)',
                borderRadius: 'var(--radius)',
                fontWeight: 600,
                fontFamily: 'inherit',
                fontSize: '0.9375rem',
                padding: '0.5625rem 1.5rem',
                marginTop: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Choose files
            </button>
          )}
        </div>
      )}
    </div>
  )
}
