'use client'

import { SelectInput, useField } from '@payloadcms/ui'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StatusSelectComponent: React.FC<any> = (props) => {
  const { path, user, readOnly } = props
  const { value, setValue } = useField<string>({ path })

  const isUser = user?.role === 'user'
  const isLocked = isUser && value === 'pending'

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

  if (isLocked) {
    return (
      <div className="field-type select-field">
        <div className="field-label">
          <label>Status</label>
        </div>
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            color: '#6b7280',
            marginBottom: '8px',
          }}
        >
          {currentOption?.label || 'Pending Review'}
        </div>
        <div
          className="field-description"
          style={{
            fontSize: '13px',
            color: '#6b7280',
            fontStyle: 'italic',
          }}
        >
          ⏳ Your abstract has been submitted for review. The status will be updated by an admin.
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
