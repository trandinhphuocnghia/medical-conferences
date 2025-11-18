'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { AbstractSchema } from '@/schemas/abstract.schema'

export async function createAbstract(data: AbstractSchema) {
  try {
    const payload = await getPayload({ config: configPromise })

    const abstract = await payload.create({
      collection: 'abstracts',
      data: { ...data, conference: 1, topic: Number(data?.topic) }, //TODO
      req: {
        headers: {
          Authorization: 'dsdssdsd',
        },
      },
    })

    return { success: true, abstract }
  } catch (error) {
    return { success: false, error }
  }
}
