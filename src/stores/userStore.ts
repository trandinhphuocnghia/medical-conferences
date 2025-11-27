import { create } from 'zustand'
import type { User } from '@/payload-types'

interface UserStore {
  user: User | null
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  fetchUser: async () => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include',
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        set({ user: data.user || null })
      } else {
        set({ user: null })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      set({ user: null })
    }
  },

  setUser: (user) => set({ user }),
}))
