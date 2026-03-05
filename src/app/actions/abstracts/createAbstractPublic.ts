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
  topic: number | 'other'
  otherTopic?: string
  // Body sections
  nameOfStudy?: string
  aim: string
  methods: string
  results: string
  conclusion: string
  // Keywords
  keywords?: { word: string }[]
  // Uploaded file — the public-files doc ID returned by onUploadComplete
  publicFileId?: number
}

export async function createAbstractPublic(data: PublicAbstractData) {
  try {
    const payload = await getPayload({ config: configPromise })

    const { publicFileId, otherTopic, ...rest } = data

    const abstract = await payload.create({
      collection: 'abstracts',
      overrideAccess: true, // public submission — bypass access control
      data: {
        ...rest,
        // If "other" was selected, null out the relationship and store the custom topic
        topic: rest.topic === 'other' ? (null as unknown as number) : rest.topic,
        ...(rest.topic === 'other' && otherTopic ? { otherTopic } : {}),
        status: 'pending', // goes straight to pending for admin review
        submitter: null as unknown as number, // no user account required
        // Link the uploaded file if one was provided
        ...(publicFileId ? { files: [publicFileId] } : {}),
      },
    })

    return { success: true, id: abstract.id }
  } catch (error) {
    console.error('[createAbstractPublic] Error:', error)
    const message = error instanceof Error ? error.message : 'Submission failed. Please try again.'
    return { success: false, error: message }
  }
}
