import { Abstract, Post } from '@/payload-types'
import { APIError, type CollectionBeforeChangeHook } from 'payload'

export const checkDeadline: CollectionBeforeChangeHook<Abstract> = async ({ data, req }) => {
  // Admins can bypass deadline
  if (req.user?.role === 'admin') return data

  const payload = req.payload
  const conferenceId = typeof data.conference === 'object' ? data.conference?.id : data.conference

  if (!conferenceId) return data

  // Fetch conference details including deadline
  const conference = (await payload.findByID({
    collection: 'posts',
    id: conferenceId,
  })) as Post

  if (!conference.abstractSubmissionDeadline) return data

  const deadline = new Date(conference.abstractSubmissionDeadline)
  const now = new Date()

  if (now > deadline) {
    throw new APIError(
      'Abstract submission deadline has passed for this conference.',
      400,
      null,
      true,
    )
  }

  return data
}
