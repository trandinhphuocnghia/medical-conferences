'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import './index.scss'

const BackToFrontend: React.FC = () => {
  return (
    <Link href="/conferences" className="back-to-frontend-link">
      <ArrowLeft className="back-to-frontend-icon" />
      <span className="back-to-frontend-text">Back to MedConf</span>
    </Link>
  )
}

export default BackToFrontend
