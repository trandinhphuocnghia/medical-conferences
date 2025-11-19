'use client'

import { useAuth } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

export default function BeforeDashboardClient() {
  const { user } = useAuth()
  if (user?.role !== 'admin') {
    redirect('/admin/account')
  }
  return <React.Fragment />
}
