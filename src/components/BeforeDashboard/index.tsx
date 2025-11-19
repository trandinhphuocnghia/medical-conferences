import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'
import { redirect } from 'next/navigation'
import { getMeUser } from '@/utilities/getMeUser'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = async () => {
  const { user } = await getMeUser()
  if (user?.role !== 'admin') {
    redirect('/admin/account')
  }

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      {/* TODO: may add some statistic later */}
    </div>
  )
}

export default BeforeDashboard
