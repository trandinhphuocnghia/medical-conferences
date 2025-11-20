'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { AbstractSchema } from '@/schemas/abstract.schema'
import { getMeUser } from '@/utilities/getMeUser'

export async function createAbstract(conference: number, data: AbstractSchema) {
  try {
    const payload = await getPayload({ config: configPromise })

    const { user } = await getMeUser()

    const abstract = await payload.create({
      collection: 'abstracts',
      overrideAccess: false,
      data: {
        ...data,
        conference,
        topic: Number(data.topic),
        status: 'pending',
        submitter: user.id,
      },
      draft: false,
    })

    return { success: true, abstract }
  } catch (error) {
    return { success: false, error }
  }
}
