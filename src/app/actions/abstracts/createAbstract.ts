'use server'
import configPromise from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { AbstractFormSchema } from '@/schemas/abstract.schema'
import { uploadFile } from '../files/upload'

export async function createAbstract(
  conference: number,
  data: AbstractFormSchema,
) {
  try {
    const payload = await getPayload({ config: configPromise })

    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    if (!user) throw Error('No permission')

    // Handle file uploads
    const uploadedFiles: { url: string }[] = []
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        const uploadRes = await uploadFile(file)
        if (uploadRes.success && uploadRes.res?.url) {
          uploadedFiles.push({ url: uploadRes.res.url })
        } else {
          throw new Error(`Failed to upload file: ${file.name}`)
        }
      }
    }

    const abstract = await payload.create({
      collection: 'abstracts',

      data: {
        ...data,
        files: uploadedFiles,
        conference: Number(conference),
        topic: Number(data.topic),
        status: 'pending',
        submitter: user.id,
      },
      draft: false,

      overrideAccess: false,
      req: {
        headers,
        user,
      },
    })

    return { success: true, abstract }
  } catch (error) {
    console.error('Create abstract error:', error)
    return { success: false, error }
  }
}
