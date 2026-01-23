import { Abstract } from '@/payload-types'

export const checkValidStatus = (doc: Abstract, status: string[]) => {
  if (!doc?.status) return false
  return status.includes(doc.status as string)
}
