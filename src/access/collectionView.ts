import { ClientUser } from 'payload'

// using to show/hide collection in menu

export const adminView = ({ user }: { user: ClientUser }) => {
  return user?.role === 'admin'
}

export const modifierView = ({ user }: { user: ClientUser }) => {
  return user?.role === 'modifier'
}

export const userView = ({ user }: { user: ClientUser }) => {
  return user?.role === 'user'
}
