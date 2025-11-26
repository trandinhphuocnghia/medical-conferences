import { Abstract, User } from '@/payload-types'
import { CollectionAfterChangeHook, getPayload } from 'payload'
import configPromise from '@payload-config'
import { abstractCreateMail } from '@/services/email/mail-templates/abstract-create'
import { abstractApprovedMail } from '@/services/email/mail-templates/abstract-approved'
import { abstractRejectedMail } from '@/services/email/mail-templates/abstract-rejected'

export const sendAbstractEmail: CollectionAfterChangeHook<Abstract> = async ({
  data,
  doc,
  operation,
}) => {
  const payload = await getPayload({ config: configPromise })
  if (operation === 'create') {
    payload.sendEmail({
      defaultFromName: 'MedConf',
      to: (doc.submitter as User).email,
      subject: 'MedConf - Abstract Submitted',
      html: abstractCreateMail(doc),
    })
    return
  }

  if (data.status === 'verified') {
    payload.sendEmail({
      to: (doc.submitter as User).email,
      subject: 'Abstract Verified',
      text: abstractApprovedMail({
        userName: (doc.submitter as User).firstName,
        abstractTitle: doc.title,
        abstractLink: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/abstracts/${doc.id}`,
      }),
    })
    return
  }

  if (data.status === 'rejected') {
    payload.sendEmail({
      to: (doc.submitter as User).email,
      subject: 'Abstract Rejected',
      text: abstractRejectedMail({
        userName: (doc.submitter as User).firstName,
        abstractTitle: doc.title,
        rejectionReason: doc.reason || '',
      }),
    })
    return
  }
}
