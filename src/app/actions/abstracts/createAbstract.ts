'use server'
import configPromise from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { AbstractFormSchema } from '@/schemas/abstract.schema'
import { uploadFile } from '../files/upload'

export async function createAbstract(data: AbstractFormSchema & { conference: number }) {
  const conferenceId = data.conference
  try {
    const payload = await getPayload({ config: configPromise })

    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    if (!user) throw Error('No permission')

    // Handle file uploads
    const uploadedFileIds: number[] = []
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        const uploadRes = await uploadFile(file)
        if (uploadRes.success && uploadRes.res?.id) {
          uploadedFileIds.push(uploadRes.res.id)
        } else {
          throw new Error(`Failed to upload file: ${file.name}`)
        }
      }
    }

    // Build the structured Lexical description from a plain string
    const descriptionNode = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: data.description,
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    }

    const abstract = await payload.create({
      collection: 'abstracts',
      data: {
        title: data.title,
        conference: conferenceId,
        topic: data.topic,
        description: descriptionNode,
        keywords: (data.keywords ?? []).map((word) => ({ word })),
        files: uploadedFileIds,
        status: 'draft',
        submitter: user.id,
      },
      overrideAccess: false,
      req: { headers, user } as any,
    })

    return { success: true, abstract }
  } catch (error) {
    console.error('Create abstract error:', error)
    return { success: false, error }
  }
}
