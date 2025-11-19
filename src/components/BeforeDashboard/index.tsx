import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'
import BeforeDashboardClient from './client'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = async () => {
  return (
    <div className={baseClass}>
      <BeforeDashboardClient />
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      {/* TODO: may add some statistic later */}
    </div>
  )
}

export default BeforeDashboard
