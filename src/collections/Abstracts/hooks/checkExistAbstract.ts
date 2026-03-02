import { APIError, CollectionBeforeChangeHook, Where } from 'payload'

// Using a loose data type since submitterEmail won't be in generated types until next migration
type AbstractData = {
  conference?: number | string
  topic?: number | string
  submitterEmail?: string
  [key: string]: unknown
}

export const checkExistAbstract: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  const typedData = data as AbstractData
  const conference = typedData.conference
  const topic = typedData.topic

  if (!conference || !topic) return data

  if (operation === 'create') {
    const currentUserId = req.user?.id
    const submitterEmail = typedData.submitterEmail

    let whereClause: Where

    if (currentUserId) {
      whereClause = {
        and: [
          { conference: { equals: conference } },
          { topic: { equals: topic } },
          { submitter: { equals: currentUserId } },
          { status: { in: ['pending', 'verified'] } },
        ],
      }
    } else {
      whereClause = {
        and: [
          { conference: { equals: conference } },
          { topic: { equals: topic } },
          { submitterEmail: { equals: submitterEmail } },
          { status: { in: ['pending', 'verified'] } },
        ],
      }
    }

    const existing = await req.payload.find({
      collection: 'abstracts',
      overrideAccess: true,
      where: whereClause,
      select: { title: true },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      throw new APIError(`Abstract already exists for this conference and topic.`, 400, null, true)
    }
  }

  return data
}
