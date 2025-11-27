'use client'

import Link from 'next/link'
import React from 'react'
import './index.scss'

const BackToFrontend: React.FC = () => {
  return (
    <div className="back-to-frontend">
      <Link href="/" className="nav__link">
        ← Back to MedConf
      </Link>
    </div>
  )
}

export default BackToFrontend
