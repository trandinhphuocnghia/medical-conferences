import type { FieldHook } from 'payload'

import type { User } from '@/payload-types'

export const preventCreateAdmin: FieldHook<User> = async ({ operation, req, value }) => {
  if (operation === 'create') {
    const admins = await req.payload.find({
      collection: 'users',
      where: {
        role: { equals: 'admin' },
      },
      limit: 1,
    })

    if (admins.totalDocs > 0 && value.role === 'admin') {
      throw new Error('Can not create more admin!')
    }
  }

  return value
}
