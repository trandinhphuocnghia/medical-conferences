import type { Abstract, Post, User } from '@/payload-types'

/** 
 * Resolve the display name from the abstract — works for both authenticated
 * (submitter populated as User object) and anonymous submissions. 
 */
export function resolveSubmitterName(doc: Abstract): string {
  if (typeof doc.submitter === 'object' && doc.submitter !== null) {
    const user = doc.submitter as User
    return (user.fullname ?? `${user.firstName} ${user.lastName}`.trim()) || 'Researcher'
  }
  return ((doc as any).submitterName ?? 'Researcher') || 'Researcher'
}

/** 
 * Resolve the conference title — `conference` may be an ID (number) or a
 * populated Post object. Falls back gracefully if not populated. 
 */
export function resolveConferenceName(doc: Abstract): string {
  if (typeof doc.conference === 'object' && doc.conference !== null) {
    return (doc.conference as Post).title ?? 'Conference'
  }
  return 'Conference'
}
