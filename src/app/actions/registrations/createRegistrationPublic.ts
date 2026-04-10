'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type PublicRegistrationData = {
  email: string
  fullName: string
  organization?: string
  conferenceId: number
  joinTheGala: boolean
  notes?: string
}

export async function createRegistrationPublic(data: PublicRegistrationData) {
  try {
    const { headers: getHeaders } = await import('next/headers')
    const { submissionLimiter } = await import('@/server/rateLimit')

    if (submissionLimiter) {
      const headersList = await getHeaders()
      const forwardedFor = headersList.get('x-forwarded-for')
      const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'

      const { success, reset } = await submissionLimiter.limit(`registration:${ip}`)

      if (!success) {
        return {
          success: false,
          error: `Too many requests. Please try again after ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes.`,
        }
      }
    }

    const payload = await getPayload({ config: configPromise })


    const registration = await payload.create({
      collection: 'registrations',
      overrideAccess: true, // public submission — bypass access control
      data: {
        email: data.email,
        fullName: data.fullName,
        organization: data.organization || undefined,
        conference: data.conferenceId,
        joinTheGala: data.joinTheGala,
        notes: data.notes || undefined,
      },
    })

    return { success: true, id: registration.id }
  } catch (error) {
    console.error('[createRegistrationPublic] Error:', error)
    const message =
      error instanceof Error ? error.message : 'Registration failed. Please try again.'
    return { success: false, error: message }
  }
}
