import type { CollectionAfterReadHook, CollectionBeforeChangeHook } from 'payload'

/**
 * beforeChange — If the user selected "Other", the client sends topic = 'other'.
 * We null it out so the relationship field doesn't try to resolve a non-existent ID.
 */
export const normalizeOtherTopic: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.topic === 'other') {
    data.topic = null
  }
  return data
}

/**
 * afterRead — If topic is null but otherTopic has a value,
 * set topic back to 'other' so the UI re-selects the "Other" radio button.
 */
export const restoreOtherTopic: CollectionAfterReadHook = ({ doc }) => {
  if (!doc.topic && doc.otherTopic) {
    doc.topic = 'other'
  }
  return doc
}
