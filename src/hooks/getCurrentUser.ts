import { cookies } from 'next/headers'
import { getServerSideURL } from '@/utilities/getURL'
import type { User } from '@/payload-types'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) return null

    const response = await fetch(`${getServerSideURL()}/api/users/me`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user || null
  } catch (_error) {
    // Silently return null if there's an error
    return null
  }
}
