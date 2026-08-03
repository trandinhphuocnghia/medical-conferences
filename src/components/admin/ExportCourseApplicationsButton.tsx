'use client'

/**
 * ExportCourseApplicationsButton
 *
 * Payload CMS admin custom component — renders in the Course Applications
 * list view (beforeListTable slot). Admin selects a course from a dropdown
 * and clicks "Xuất Excel" to download the .xlsx file.
 *
 * Registered in: src/collections/CourseApplications/index.ts
 *   admin.components.beforeList: ['@/components/admin/ExportCourseApplicationsButton']
 */

import { useEffect, useState, useTransition } from 'react'

interface CourseOption {
  id: number
  title: string
}

export function ExportCourseApplicationsButton() {
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Fetch course list from Payload REST API (admin session cookie is automatic)
  useEffect(() => {
    fetch('/api/courses?limit=100&depth=0&locale=vi&where[course_type][equals]=on_demand', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        const docs = (data.docs ?? []).map((d: any) => ({
          id: d.id,
          title: `${d.title ?? `Course #${d.id}`} (${new Date(d.createdAt).getUTCFullYear()})`,
        }))
        setCourses(docs)
        if (docs.length > 0) setSelectedCourseId(docs[0].id)
      })
      .catch(() => setError('Không thể tải danh sách khoá học.'))
  }, [])

  const handleExport = () => {
    if (!selectedCourseId) return

    setError(null)
    startTransition(async () => {
      try {
        const url = `/api/export/course-applications?courseId=${selectedCourseId}`
        const res = await fetch(url, { credentials: 'include' })

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: 'Lỗi không xác định' }))
          setError(body.error ?? `HTTP ${res.status}`)
          return
        }

        // Trigger browser download from blob
        const blob = await res.blob()
        const disposition = res.headers.get('Content-Disposition') ?? ''
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/)
        const filename = filenameMatch
          ? decodeURIComponent(filenameMatch[1])
          : `danh-sach-dang-ky.xlsx`

        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = filename
        a.click()
        URL.revokeObjectURL(objectUrl)
      } catch (err) {
        console.error('[ExportCourseApplications] Download error:', err)
        setError('Xuất file thất bại. Vui lòng thử lại.')
      }
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 14 }}>Xuất Excel:</span>

      <select
        id="export-course-select"
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(Number(e.target.value))}
        disabled={courses.length === 0 || isPending}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid var(--theme-elevation-150)',
          background: 'var(--theme-elevation-0)',
          color: 'var(--theme-text)',
          fontSize: 13,
          minWidth: 240,
        }}
      >
        {courses.length === 0 && (
          <option value="">Đang tải khoá học…</option>
        )}
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      <button
        id="export-course-applications-btn"
        onClick={handleExport}
        disabled={!selectedCourseId || isPending}
        style={{
          padding: '7px 18px',
          borderRadius: 6,
          border: 'none',
          background: '#1a365d',
          color: '#fff',
          fontWeight: 600,
          fontSize: 13,
          cursor: selectedCourseId && !isPending ? 'pointer' : 'not-allowed',
          opacity: !selectedCourseId || isPending ? 0.6 : 1,
          transition: 'opacity 0.15s',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {isPending ? (
          <>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            Đang xuất…
          </>
        ) : (
          <>📥 Xuất Excel</>
        )}
      </button>

      {error && (
        <span style={{ color: '#c53030', fontSize: 13 }}>⚠ {error}</span>
      )}

      {/* Spinner keyframe — injected inline so no CSS module needed */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
