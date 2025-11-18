'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getConference({ id }: { id: number }) {
  try {
    const payload = await getPayload({ config: configPromise })

    const conferences = await payload?.findByID({
      collection: 'posts',
      id,
      select: {
        topics: true,
      },
    })

    return { success: true, conferences }
  } catch (error) {
    return { success: false, error }
  }
}
