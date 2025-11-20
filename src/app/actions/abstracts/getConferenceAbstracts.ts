'use server'
import configPromise from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

export async function getConferenceAbstracts({
  conferenceId,
}: {
  conferenceId: number
}) {
  try {
    const payload = await getPayload({ config: configPromise })

    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    if (!user) throw Error('No permission')

    const res = await payload.find({
      collection: 'abstracts',
      where: {
        conference: {
          equals: conferenceId,
        },
        and: [
          {
            submitter: {
              equals: user.id,
            },
          },
        ],
      },

      select: {
        conference: false,
      },

      overrideAccess: false,
      req: {
        headers,
        user: user,
      },
    })

    return { success: true, abstracts: res?.docs }
  } catch (error) {
    return { success: false, error }
  }
}
