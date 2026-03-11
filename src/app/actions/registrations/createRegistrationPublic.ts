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
