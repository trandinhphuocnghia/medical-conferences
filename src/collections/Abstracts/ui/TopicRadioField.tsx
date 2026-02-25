'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

type Topic = {
  id: string | number
  name: string
}

type TopicRadioFieldProps = {
  path: string
}

export const TopicRadioField: React.FC<TopicRadioFieldProps> = ({ path }) => {
  const { value, setValue } = useField<string | number>({ path })

  // Watch the conference and status fields
  const conferenceId = useFormFields(([fields]) => {
    const field = fields['conference']
    if (!field) return null
    const val = field.value
    if (typeof val === 'object' && val !== null && 'id' in val) return (val as { id: string }).id
    return val as string | null
  })

  const status = useFormFields(([fields]) => fields['status']?.value as string | undefined)
  const isReadOnly = !!status && status !== 'draft'

  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!conferenceId) {
      setTopics([])
      setValue(null)
      return
    }

    setLoading(true)
    fetch(
      `/api/topics?where[conference][in][0]=${conferenceId}&where[active][equals]=true&limit=100&depth=0`,
    )
      .then((res) => res.json())
      .then((data) => {
        setTopics(data?.docs ?? [])
      })
      .catch(() => setTopics([]))
      .finally(() => setLoading(false))
  }, [conferenceId, setValue])

  if (!conferenceId) {
    return (
      <div className="field-type">
        <label className="field-label">Topic</label>
        <p style={{ color: 'var(--theme-text-disabled)', fontSize: '0.875rem' }}>
          Select a conference first to see available topics.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="field-type">
        <label className="field-label">Topic</label>
        <p style={{ fontSize: '0.875rem' }}>Loading topics...</p>
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div className="field-type">
        <label className="field-label">Topic</label>
        <p style={{ color: 'var(--theme-text-disabled)', fontSize: '0.875rem' }}>
          No active topics found for this conference.
        </p>
      </div>
    )
  }

  const currentId =
    typeof value === 'object' && value !== null && 'id' in (value as object)
      ? (value as { id: string | number }).id
      : value

  return (
    <div className="field-type">
      <label className="field-label">
        Topic <span style={{ color: 'var(--theme-error-500)' }}>*</span>
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        {topics.map((topic) => (
          <label
            key={topic.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: isReadOnly ? 'default' : 'pointer',
              fontSize: '0.875rem',
              opacity: isReadOnly ? 0.6 : 1,
            }}
          >
            <input
              type="radio"
              name={path}
              value={String(topic.id)}
              checked={String(currentId) === String(topic.id)}
              disabled={isReadOnly}
              onChange={() => !isReadOnly && setValue(topic.id)}
              style={{
                accentColor: 'var(--theme-success-500)',
                width: '1rem',
                height: '1rem',
                cursor: isReadOnly ? 'default' : 'pointer',
              }}
            />
            {topic.name}
          </label>
        ))}
      </div>
    </div>
  )
}
