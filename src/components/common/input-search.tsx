'use client'

import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from '@payloadcms/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export const InputSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearchDebounced = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }, 500)

  return (
    <Input
      type="search"
      placeholder="Search posts..."
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearchDebounced(e.target.value)
      }}
      defaultValue={searchParams.get('search') || ''}
      className="w-full"
    />
  )
}
