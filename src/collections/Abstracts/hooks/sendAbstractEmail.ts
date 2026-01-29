import { Abstract, User } from '@/payload-types'
import { abstractApprovedMail } from '@/services/email/mail-templates/abstract-approved'
import { abstractCreateMail } from '@/services/email/mail-templates/abstract-create'
import { abstractRejectedMail } from '@/services/email/mail-templates/abstract-rejected'
import { CollectionAfterChangeHook } from 'payload'

export const sendAbstractEmail: CollectionAfterChangeHook<Abstract> = async ({
  data,
  doc,
  operation,
  req,
}) => {
  // 1. Determine the recipient and content
  let emailHtml = ''
  let emailSubject = ''

  // We need the submitter's email. If not populated, we fetch it.
  const submitter =
    typeof doc.submitter === 'object'
      ? (doc.submitter as User)
      : await req.payload.findByID({
          collection: 'users',
          id: doc.submitter as number,
          select: {
            email: true,
          },
        })

  if (!submitter?.email) return

  // 2. Logic for Create (New Submission)
  if (operation === 'create') {
    emailSubject = 'MedConf - Abstract Submitted'
    emailHtml = abstractCreateMail(doc)
  }

  // 3. Logic for Update (Status Changes)
  if (operation === 'update') {
    // Fetch previous document to check if status actually changed
    const previousDoc = await req.payload.findByID({
      collection: 'abstracts',
      id: doc.id,
      select: {
        status: true,
      },
    })

    // Only send email if status actually changed
    if (data.status === 'verified' && previousDoc.status !== 'verified') {
      emailSubject = 'MedConf - Abstract Verified'
      emailHtml = abstractApprovedMail(doc)
    } else if (data.status === 'rejected' && previousDoc.status !== 'rejected') {
      emailSubject = 'MedConf - Abstract Rejected'
      emailHtml = abstractRejectedMail(doc)
    }
  }

  // 4. THE SENIOR MOVE: Create the log entry instead of sending
  if (emailHtml && emailSubject) {
    await req.payload.create({
      collection: 'mail-logs',
      data: {
        to: submitter.email,
        subject: emailSubject,
        html: emailHtml,
        status: 'pending', // The Cron job will pick this up
        retryCount: 0,
        abstractId: doc.id,
      },
    })
  }
}
