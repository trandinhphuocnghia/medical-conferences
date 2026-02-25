'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type PublicAbstractData = {
  // Submitter info
  submitterName: string
  submitterEmail: string
  submitterOrganization?: string
  // Abstract core
  title: string
  conference: number
  topic: number
  // Body sections
  nameOfStudy?: string
  aim: string
  methods: string
  results: string
  conclusion: string
  // Keywords
  keywords?: { word: string }[]
}

export async function createAbstractPublic(data: PublicAbstractData) {
  try {
    const payload = await getPayload({ config: configPromise })

    const abstract = await payload.create({
      collection: 'abstracts',
      overrideAccess: true, // public submission — bypass access control
      data: {
        ...data,
        status: 'pending', // goes straight to pending for admin review
        submitter: null as unknown as number, // no user account required
      },
    })

    return { success: true, id: abstract.id }
  } catch (error) {
    console.error('[createAbstractPublic] Error:', error)
    const message = error instanceof Error ? error.message : 'Submission failed. Please try again.'
    return { success: false, error: message }
  }
}
