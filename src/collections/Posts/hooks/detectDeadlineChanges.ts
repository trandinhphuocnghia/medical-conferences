import type { CollectionBeforeChangeHook } from 'payload'

/**
 * detectDeadlineChanges
 * 
 * Automatically detects if important milestones (abstract submission and notification acceptance)
 * have been updated and flags them as "Extended" or "Changed" while preserving the old values.
 */
export const detectDeadlineChanges: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  operation,
}) => {
  // Only detect changes during updates (not initial creation)
  if (operation === 'update' && originalDoc) {
    
    // 1. Detect Abstract Submission Deadline Extension
    if (
      data.abstractSubmissionDeadline && 
      originalDoc.abstractSubmissionDeadline &&
      data.abstractSubmissionDeadline !== originalDoc.abstractSubmissionDeadline
    ) {
      const newDate = new Date(data.abstractSubmissionDeadline).getTime()
      const oldDate = new Date(originalDoc.abstractSubmissionDeadline).getTime()
      
      if (newDate > oldDate) {
        // Extended — store the old date and flag it
        data.abstractDeadlineExtended = true
        data.previousAbstractDeadline = originalDoc.abstractSubmissionDeadline
      } else {
        // Shortened or reverted — clear the highlight
        data.abstractDeadlineExtended = false
        data.previousAbstractDeadline = null
      }
    }

    // 2. Detect Notification Date Change
    if (
      data.notificationOfAcceptanceDate && 
      originalDoc.notificationOfAcceptanceDate &&
      data.notificationOfAcceptanceDate !== originalDoc.notificationOfAcceptanceDate
    ) {
      const newDate = new Date(data.notificationOfAcceptanceDate).getTime()
      const oldDate = new Date(originalDoc.notificationOfAcceptanceDate).getTime()

      if (newDate > oldDate) {
        data.notificationDateChanged = true
        data.previousNotificationDate = originalDoc.notificationOfAcceptanceDate
      } else {
        data.notificationDateChanged = false
        data.previousNotificationDate = null
      }
    }
  }

  return data
}
