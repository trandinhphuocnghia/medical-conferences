'use client'

import { SelectInput, useAuth, useField } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StatusSelectComponent: React.FC<any> = (props) => {
  const { path, readOnly } = props
  const { value, setValue } = useField<string>({ path })
  const authData = useAuth()

  const [isUser, setIsUser] = useState(authData?.user?.role === 'user')

  useEffect(() => {
    // Only update if we actually have user role data
    // Don't reset when auth context briefly loses data during hydration
    if (authData?.user?.role) {
      setIsUser(authData.user.role === 'user')
    }
  }, [authData?.user])

  // Derive isLockedStatus from stable isUser state
  const isLockedStatus = isUser && ['pending', 'accepted', 'rejected', 'verified'].includes(value)

  // Filter options based on role
  const allOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Submit for Review', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Verified', value: 'verified' },
  ]

  const userOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Submit for Review', value: 'pending' },
  ]

  const options = isUser ? userOptions : allOptions

  // Get current option label for locked state
  const currentOption = allOptions.find((opt) => opt.value === value)

  // Status-specific styling and messages
  const statusConfig: Record<
    string,
    { icon: string; bgColor: string; borderColor: string; textColor: string; message: string }
  > = {
    pending: {
      icon: '⏳',
      bgColor: '#fef3c7',
      borderColor: '#f59e0b',
      textColor: '#92400e',
      message:
        'Your abstract has been submitted for review. The status will be updated by an admin.',
    },
    accepted: {
      icon: '✅',
      bgColor: '#d1fae5',
      borderColor: '#10b981',
      textColor: '#065f46',
      message: 'Congratulations! Your abstract has been accepted.',
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

  const config = statusConfig[value] || statusConfig.pending

  if (isLockedStatus) {
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
          {currentOption?.label || 'Pending Review'}
        </div>
        <div
          className="field-description"
          style={{
            fontSize: '13px',
            color: config.textColor,
            fontStyle: 'italic',
          }}
        >
          {config.message}
        </div>
      </div>
    )
  }

  return (
    <div className="field-type select-field">
      <SelectInput
        {...props}
        path={path}
        name={path}
        options={options}
        value={value}
        onChange={(option) => {
          if (option && !Array.isArray(option)) {
            setValue(option.value)
          }
        }}
        readOnly={readOnly}
      />
    </div>
  )
}
