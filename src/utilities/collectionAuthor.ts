import { Field } from 'payload'

export const author: Field[] = [
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    label: 'Created By',
    defaultValue: ({ req }) => {
      return req.user?.id
    },
    admin: {
      readOnly: true,
      hidden: true,
      position: 'sidebar',
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    label: 'Last Modified By',
    defaultValue: ({ req }) => {
      return req.user?.id
    },
    admin: {
      readOnly: true,
      hidden: true,
      position: 'sidebar',
    },
  },
]
