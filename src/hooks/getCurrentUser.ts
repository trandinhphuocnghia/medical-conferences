import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export async function getCurrentUser() {
  const payload = await getPayload({ config: configPromise })

  try {
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) return null

    return user
  } catch (err) {
    console.error('getCurrentUser() error:', err)
    return null
  }
}
