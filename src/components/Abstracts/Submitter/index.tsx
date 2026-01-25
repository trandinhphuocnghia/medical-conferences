'use client'
import { User } from '@/payload-types'
import { useFormFields } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'
import './index.scss'

const SubmitterProfilePreview: React.FC = () => {
  // 1. Get the submitter ID from the relationship field in the form
  const submitterField = useFormFields(([fields]) => fields.submitter)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const userId = submitterField?.value

  useEffect(() => {
    if (userId) {
      setLoading(true)
      // Fetch the user data from the Payload API
      fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [userId])

  if (!userId) return null
  if (loading) return <div className="profile-preview-loading">Loading Submitter Data...</div>
  if (!userData) return null

  return (
    <div className="submitter-profile-card">
      <div className="card-header">
        <span className="badge">Submitter Credentials</span>
      </div>

      <div className="card-body">
        <div className="user-main">
          <h3 className="user-name">
            {userData.title} {userData.firstName} {userData.lastName}
          </h3>
          <p className="user-email">{userData.email}</p>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>Institution</label>
            <span>{userData.organization || 'Not Specified'}</span>
          </div>
          <div className="detail-item">
            <label>Specialization</label>
            <span>{userData.specialization || 'Not Specified'}</span>
          </div>
          <div className="detail-item">
            <label>License Number</label>
            <span className="mono">{userData.medicalLicenseNumber || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <span>{userData.phoneNumber || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitterProfilePreview
