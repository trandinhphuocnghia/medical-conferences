import { Post } from '@/payload-types'
import { CollectionBeforeValidateHook, ValidationError } from 'payload'

export const afterToday = new Date(new Date().setDate(new Date().getDate() + 1))

export const beforeValidateDate: CollectionBeforeValidateHook<Post> = ({
  data = {},
  originalDoc,
}) => {
  const rawStart = data?.startDate || originalDoc?.startDate
  const rawEnd = data?.endDate || originalDoc?.endDate

  if (!rawStart || !rawEnd) return data

  const start = new Date(rawStart)
  const end = new Date(rawEnd)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return data

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  if (start < tomorrow) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'startDate',
          message: 'Start date must be tomorrow or later.',
        },
      ],
    })
  }

  if (end < tomorrow) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'endDate',
          message: 'End date must be tomorrow or later.',
        },
      ],
    })
  }

  if (end <= start) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'startDate',
          message: 'End date cannot be earlier than start date.',
        },
        {
          path: 'endDate',
          message: 'End date cannot be earlier than start date.',
        },
      ],
    })
  }

  const submission = data.abstractSubmissionDeadline
    ? new Date(data.abstractSubmissionDeadline)
    : null
  const notification = data.notificationOfAcceptanceDate
    ? new Date(data.notificationOfAcceptanceDate)
    : null
  const registration = data.earlyRegistrationDeadline
    ? new Date(data.earlyRegistrationDeadline)
    : null

  if (submission && notification && notification <= submission) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'notificationOfAcceptanceDate',
          message:
            'Notification date must be strictly after the Abstract Submission Deadline.',
        },
      ],
    })
  }

  if (notification && registration && registration <= notification) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'earlyRegistrationDeadline',
          message:
            'Early Registration deadline must be strictly after the Notification of Acceptance Date.',
        },
      ],
    })
  }

  if (submission && submission >= start) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'abstractSubmissionDeadline',
          message:
            'Abstract Submission Deadline must be before the Conference Start Date.',
        },
      ],
    })
  }
  if (notification && notification >= start) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'notificationOfAcceptanceDate',
          message:
            'Notification Date must be before the Conference Start Date.',
        },
      ],
    })
  }
  if (registration && registration >= start) {
    throw new ValidationError({
      collection: 'posts',
      errors: [
        {
          path: 'earlyRegistrationDeadline',
          message:
            'Early Registration Deadline must be before the Conference Start Date.',
        },
      ],
    })
  }

  return data
}
