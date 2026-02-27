import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import type { User } from '../payload-types'
import { getClientSideURL } from './getURL'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
  requireAuth?: boolean
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect, requireAuth } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  const {
    user,
  }: {
    user: User
  } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect)
  }

  // Auto-redirect to /signin?redirect=<current-path> if required
  if (requireAuth && (!meUserReq.ok || !user)) {
    const headerStore = await headers()
    const currentPath = headerStore.get('x-pathname') || '/'
    redirect(`/signin?redirect=${encodeURIComponent(currentPath)}`)
  }

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user,
  }
}
