'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function uploadFile(file: File) {
  try {
    const payload = await getPayload({ config: configPromise })

    const arrayBuffer = await file.arrayBuffer()

    // 2. Convert the ArrayBuffer into a Node.js Buffer
    const fileBuffer = Buffer.from(arrayBuffer)

    const res = await payload.create({
      collection: 'files',
      overrideAccess: false,
      file: {
        data: fileBuffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      draft: false,
      data: {
        filename: file.name,
      },
    })

    return { success: true, res }
  } catch (error) {
    return { success: false, error }
  }
}
