import { Post } from '@/payload-types'
import { CollectionBeforeValidateHook, ValidationError } from 'payload'

export const afterToday = new Date(new Date().setDate(new Date().getDate() + 1))

export const beforeValidateDate: CollectionBeforeValidateHook<Post> = ({
  data = {},
}) => {
  if (!data.startDate || !data.endDate) return data

  const start = new Date(data.startDate)
  const end = new Date(data.endDate)

  // tomorrow at 00:00
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  // rule 1: startDate must be >= tomorrow
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

  // rule 2: endDate must be >= tomorrow
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

  // rule 3: endDate must be >= startDate
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

  return data
}
