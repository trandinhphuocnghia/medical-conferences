'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'

export function UserStoreInitializer() {
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return null
}
