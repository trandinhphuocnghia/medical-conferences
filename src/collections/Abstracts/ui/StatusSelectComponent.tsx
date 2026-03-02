'use client'

import type { User } from '@/payload-types'
import { SelectInput, useAuth, useField } from '@payloadcms/ui'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StatusSelectComponent: React.FC<any> = (props) => {
  const { path, readOnly } = props
  const { value, setValue } = useField<string>({ path })
  const { user } = useAuth<User>()

  const isUser = user?.role === 'user'
  const isAdmin = user?.role === 'admin'

  // ── Options per role ─────────────────────────────────────────
  const userOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Submit for Review', value: 'pending' },
  ]

  const adminOptions = [
    { label: 'Rejected', value: 'rejected' },
    { label: 'Verified', value: 'verified' },
  ]

  const allOptions = [...userOptions, ...adminOptions]
  const options = isUser ? userOptions : adminOptions

  const currentOption = allOptions.find((opt) => opt.value === value)

  // ── Status badge config (shown for users with locked status, and for admins on draft/pending) ──
  const statusConfig: Record<
    string,
    { icon: string; bgColor: string; borderColor: string; textColor: string; message: string }
  > = {
    draft: {
      icon: '📝',
      bgColor: '#f3f4f6',
      borderColor: '#9ca3af',
      textColor: '#374151',
      message: 'Abstract is in draft mode.',
    },
    pending: {
      icon: '⏳',
      bgColor: '#fef3c7',
      borderColor: '#f59e0b',
      textColor: '#92400e',
      message: 'Submitted for review. Update the status below once a decision is made.',
    },

    rejected: {
      icon: '❌',
      bgColor: '#fee2e2',
      borderColor: '#ef4444',
      textColor: '#991b1b',
      message: 'Your abstract was not accepted. Please contact the organizers for feedback.',
    },
    verified: {
      icon: '✓',
      bgColor: '#dbeafe',
      borderColor: '#3b82f6',
      textColor: '#1e40af',
      message: 'Your abstract has been verified and published.',
    },
  }

  const config = statusConfig[value] ?? statusConfig.pending

  // ── User: locked status badge (read-only) ─────────────────────
  const isUserLockedStatus = isUser && ['pending', 'rejected', 'verified'].includes(value)

  if (isUserLockedStatus) {
    return (
      <div className="field-type select-field">
        <div className="field-label">
          <label>Status</label>
        </div>
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: config.bgColor,
            border: `2px solid ${config.borderColor}`,
            borderRadius: '4px',
            color: config.textColor,
            marginBottom: '8px',
            fontWeight: '500',
          }}
        >
          <span style={{ marginRight: '8px' }}>{config.icon}</span>
          {currentOption?.label ?? 'Pending Review'}
        </div>
        <div
          className="field-description"
          style={{ fontSize: '13px', color: config.textColor, fontStyle: 'italic' }}
        >
          {config.message}
        </div>
      </div>
    )
  }

  // ── Admin: show current status badge (if draft/pending) + action dropdown ──
  if (isAdmin && ['draft', 'pending'].includes(value)) {
    return (
      <div className="field-type select-field">
        <div className="field-label">
          <label>Status</label>
        </div>
        {/* Current status badge */}
        <div
          style={{
            padding: '6px 12px',
            backgroundColor: config.bgColor,
            border: `2px solid ${config.borderColor}`,
            borderRadius: '4px',
            color: config.textColor,
            marginBottom: '8px',
            fontWeight: '500',
            fontSize: '13px',
          }}
        >
          <span style={{ marginRight: '8px' }}>{config.icon}</span>
          {currentOption?.label ?? value}
        </div>
        <div
          className="field-description"
          style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}
        >
          {config.message}
        </div>
        {/* Action dropdown */}
        <SelectInput
          {...props}
          path={path}
          name={path}
          options={adminOptions}
          value={value}
          onChange={(option) => {
            if (option && !Array.isArray(option)) setValue(option.value)
          }}
          readOnly={readOnly}
        />
      </div>
    )
  }

  // ── Default: standard dropdown for the current role ───────────
  return (
    <div className="field-type select-field">
      <SelectInput
        {...props}
        path={path}
        name={path}
        options={options}
        value={value}
        onChange={(option) => {
          if (option && !Array.isArray(option)) setValue(option.value)
        }}
        readOnly={readOnly}
      />
    </div>
  )
}
