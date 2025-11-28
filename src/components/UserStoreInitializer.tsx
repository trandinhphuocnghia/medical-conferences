'use client'

import { useRef } from 'react'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/payload-types'

export function UserStoreInitializer({ user }: { user: User | null }) {
  const initialized = useRef(false)

  if (!initialized.current) {
    useUserStore.setState({ user })
    initialized.current = true
  }

  return null
}
