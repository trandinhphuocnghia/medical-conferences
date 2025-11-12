import { ClientUser } from 'payload'

export const notAdminView = ({ user }: { user: ClientUser }) => {
  return !user?.roles.includes('admin')
}

export const notModifierView = ({ user }: { user: ClientUser }) => {
  return !user?.roles.includes('modifier')
}

export const notAdminOrModifierView = ({ user }: { user: ClientUser }) => {
  return !user?.roles.includes('admin') && !user?.roles.includes('modifier')
}
