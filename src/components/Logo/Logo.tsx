'use client'
import { cn } from '@/utilities/utils'
import Image from 'next/image'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <div className={cn('overflow-hidden rounded-md inline-block', className)}>
      <Image
        alt="HIGCF Logo"
        width={60}
        height={60}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className="w-auto h-full object-contain mix-blend-multiply"
        src="/logo.jpg"
      />
    </div>
  )
}
