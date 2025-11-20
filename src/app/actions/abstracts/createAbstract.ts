'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { AbstractSchema } from '@/schemas/abstract.schema'

export async function createAbstract(conference: number, data: AbstractSchema) {
  try {
    const payload = await getPayload({ config: configPromise })

    const abstract = await payload.create({
      collection: 'abstracts',
      overrideAccess: false,
      data: {
        ...data,
        conference,
        topic: Number(data.topic),
        status: 'pending',
      },
      draft: false,
    })

    return { success: true, abstract }
  } catch (error) {
    return { success: false, error }
  }
}
