import { Abstract, User } from '@/payload-types'
import { CollectionAfterChangeHook } from 'payload'
import { abstractCreateMail } from '@/services/email/mail-templates/abstract-create'
import { abstractApprovedMail } from '@/services/email/mail-templates/abstract-approved'
import { abstractRejectedMail } from '@/services/email/mail-templates/abstract-rejected'

export const sendAbstractEmail: CollectionAfterChangeHook<Abstract> = async ({
  data,
  doc,
  operation,
  req,
}) => {
  if (operation === 'create') {
    req.payload.sendEmail({
      to: (doc.submitter as User).email,
      subject: 'MedConf - Abstract Submitted',
      html: abstractCreateMail(doc),
    })
    return
  }

  if (operation === 'update') {
    const populatedDoc = await req.payload.findByID({
      collection: 'abstracts',
      id: doc.id,
      depth: 2,
    })

    const currentAbstract = {
      ...populatedDoc,
      ...doc,
      submitter: populatedDoc.submitter,
      conference: populatedDoc.conference,
    }

    const submitter = currentAbstract.submitter as User
    if (data.status === 'verified') {
      req.payload.sendEmail({
        to: submitter.email,
        subject: 'MedConf - Abstract Verified',
        html: abstractApprovedMail(currentAbstract),
      })
      return
    }

    if (data.status === 'rejected') {
      req.payload.sendEmail({
        to: submitter.email,
        subject: 'MedConf - Abstract Rejected',
        html: abstractRejectedMail(currentAbstract),
      })
      return
    }
  }
}
