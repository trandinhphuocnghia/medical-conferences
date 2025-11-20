'use server'
import configPromise from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { AbstractSchema } from '@/schemas/abstract.schema'

export async function createAbstract(conference: number, data: AbstractSchema) {
  try {
    const payload = await getPayload({ config: configPromise })

    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    if (!user) throw Error('No permission')

    const abstract = await payload.create({
      collection: 'abstracts',

      data: {
        ...data,
        conference: Number(conference),
        topic: Number(data.topic),
        status: 'pending',
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
    return { success: false, error }
  }
}
