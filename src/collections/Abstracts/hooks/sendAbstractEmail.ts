import { Abstract, User } from '@/payload-types'
import { abstractApprovedMail } from '@/services/email/mail-templates/abstract-approved'
import { abstractCreateMail } from '@/services/email/mail-templates/abstract-create'
import { abstractRejectedMail } from '@/services/email/mail-templates/abstract-rejected'
import { CollectionAfterChangeHook } from 'payload'

export const sendAbstractEmail: CollectionAfterChangeHook<Abstract> = async ({
  data,
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // 1. Determine the recipient and content
  let emailHtml = ''
  let emailSubject = ''

  // We need the submitter's email. Use the user relationship or the anonymous email field.
  const submitterEmail =
    typeof doc.submitter === 'object' && doc.submitter !== null
      ? (doc.submitter as User).email
      : typeof doc.submitter === 'number'
        ? (
            await req.payload.findByID({
              collection: 'users',
              id: doc.submitter as number,
              select: { email: true },
            })
          )?.email
        : (doc as any).submitterEmail // anonymous submission

  if (!submitterEmail) return

  // 2. Logic for Create (New Submission)
  if (operation === 'create') {
    emailSubject = 'HIGCF - Abstract Submitted'
    emailHtml = abstractCreateMail(doc)
  }

  // 3. Logic for Update (Status Changes)
  if (operation === 'update' && previousDoc) {
    // Only send email if status actually changed
    if (data.status === 'verified' && previousDoc.status !== 'verified') {
      emailSubject = 'HIGCF - Abstract Verified'
      emailHtml = abstractApprovedMail(doc)
    } else if (data.status === 'rejected' && previousDoc.status !== 'rejected') {
      emailSubject = 'HIGCF - Abstract Rejected'
      emailHtml = abstractRejectedMail(doc)
    }
  }

  // 4. Create the mail log entry — cron job picks it up and sends
  if (emailHtml && emailSubject) {
    await req.payload.create({
      collection: 'mail-logs',
      data: {
        to: submitterEmail,
        subject: emailSubject,
        html: emailHtml,
        status: 'pending',
        retryCount: 0,
        abstractId: doc.id,
      },
      req,
      overrideAccess: true,
    })
  }

  return data
}
