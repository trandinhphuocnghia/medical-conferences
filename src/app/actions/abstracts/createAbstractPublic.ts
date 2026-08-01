'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type PublicAbstractData = {
  // Submitter info
  submitterName: string
  submitterEmail: string
  submitterOrganization?: string
  // Presentation language — required from the public form
  presentationLanguage: 'english' | 'vietnamese'
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
  // Uploaded files — the public-files doc IDs returned by onUploadComplete
  publicFileIds?: number[]
}

export async function createAbstractPublic(data: PublicAbstractData) {
  try {
    const { headers: getHeaders } = await import('next/headers')
    const { submissionLimiter } = await import('@/server/rateLimit')

    if (submissionLimiter) {
      const headersList = await getHeaders()

      // IP extraction: follow Cloudflare → Nginx/Vercel → standard proxy → fallback
      const ip =
        headersList.get('cf-connecting-ip') ??
        headersList.get('x-real-ip') ??
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        '127.0.0.1'

      try {
        const { success, reset } = await submissionLimiter.limit(`abstract:${ip}`)

        if (!success) {
          return {
            success: false,
            error: `Too many requests. Please try again after ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes.`,
          }
        }
      } catch (error) {
        console.error('[Abstract] Rate-limit service unavailable:', error)
        return {
          success: false,
          error: 'Service temporarily unavailable. Please try again later.',
        }
      }
    }
    
    const payload = await getPayload({ config: configPromise })

    const { publicFileIds, otherTopic, ...rest } = data

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
        // Link uploaded files if any were provided
        ...(publicFileIds && publicFileIds.length > 0 ? { files: publicFileIds } : {}),
      },
    })

    return { success: true, id: abstract.id }
  } catch (error) {
    console.error('[createAbstractPublic] Error:', error)
    const message = error instanceof Error ? error.message : 'Submission failed. Please try again.'
    return { success: false, error: message }
  }
}
