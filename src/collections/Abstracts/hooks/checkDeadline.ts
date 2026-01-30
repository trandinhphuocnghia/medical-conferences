import { Abstract, Post } from '@/payload-types'
import { APIError, type CollectionBeforeChangeHook } from 'payload'

export const checkDeadline: CollectionBeforeChangeHook<Abstract> = async ({ data, req }) => {
  const { payload, user } = req
  const conferenceId = typeof data.conference === 'object' ? data.conference?.id : data.conference

  if (!conferenceId) return data

  // 1. Optimization: Only fetch the fields we need
  const conference = (await payload.findByID({
    collection: 'posts',
    id: conferenceId,
    select: {
      abstractSubmissionDeadline: true,
      notificationOfAcceptanceDate: true,
    },
  })) as Post

  if (!conference) return data

  const now = new Date()
  const isAdmin = user?.role === 'admin'

  // 2. Determine which deadline to check
  const deadlineField = isAdmin
    ? conference.notificationOfAcceptanceDate
    : conference.abstractSubmissionDeadline

  const errorMessage = isAdmin
    ? 'Notification of acceptance date has passed.'
    : 'Abstract submission deadline has passed.'

  if (!deadlineField) return data

  // 3. Comparison
  if (now > new Date(deadlineField)) {
    throw new APIError(errorMessage, 400, null, true)
  }

  return data
}
