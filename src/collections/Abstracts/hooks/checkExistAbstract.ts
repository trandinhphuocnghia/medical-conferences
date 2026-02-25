import { Abstract } from '@/payload-types'
import { APIError, CollectionBeforeChangeHook } from 'payload'

export const checkExistAbstract: CollectionBeforeChangeHook<Abstract> = async ({
  data,
  req,
  operation,
}) => {
  const payload = req.payload

  const conference = data.conference
  const topic = data.topic

  if (!conference || !topic) return

  const currentUser = req.user?.id

  // Check if an abstract with same conf + topic exists
  if (operation === 'create') {
    const existing = await payload.find({
      collection: 'abstracts',
      where: {
        and: [
          { conference: { equals: conference } },
          { topic: { equals: topic } },
          { submitter: { equals: currentUser } },
          { status: { in: ['pending', 'accepted', 'verified'] } },
        ],
      },
      select: { title: true },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      throw new APIError(`Abstract already exists for this conference and topic.`, 400, null, true)
    }
  }

  return data
}
