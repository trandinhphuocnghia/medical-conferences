'use client'

import { useDocumentInfo, useForm } from '@payloadcms/ui'
import React, { useCallback } from 'react'

/**
 * A custom Admin UI component that auto-fills email, password, and confirm password
 * with generated values. Only shown when creating a new user.
 */
export const GenerateCredentialsButton: React.FC = () => {
  const { id } = useDocumentInfo()
  const { setModified, dispatchFields } = useForm()

  const handleGenerate = useCallback(() => {
    // Generate a random 8-char hex string for the email
    const randomId = Math.random().toString(36).substring(2, 10)
    const email = `temp-${randomId}@higcf2026.org`

    // Generate a random 16-char password
    const password = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Use Payload's form dispatch to set field values
    dispatchFields({
      type: 'UPDATE',
      path: 'email',
      value: email,
    })

    dispatchFields({
      type: 'UPDATE',
      path: 'password',
      value: password,
    })

    dispatchFields({
      type: 'UPDATE',
      path: 'confirm-password',
      value: password,
    })

    setModified(true)
  }, [dispatchFields, setModified])

  // Hide on edit pages — only show when creating a new user
  if (id) return null

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button
        type="button"
        onClick={handleGenerate}
        style={{
          backgroundColor: '#f59e0b',
          color: '#1a1a2e',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '13px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d97706')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f59e0b')}
      >
        ⚡ Generate Credentials
      </button>
      <p
        style={{
          fontSize: '12px',
          color: '#888',
          marginTop: '6px',
          marginBottom: 0,
        }}
      >
        Auto-fills email + password with temporary values for admin-created accounts.
      </p>
    </div>
  )
}
