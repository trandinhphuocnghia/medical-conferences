import { BasePayload, EmailAdapter } from 'payload'
import { Resend } from 'resend'

const resendAdapter: EmailAdapter = ({ payload: _payload }: { payload: BasePayload }) => {
  const resend = new Resend(process.env.RESEND_API_KEY)

  return {
    name: 'Resend Adapter',
    defaultFromAddress: process.env.MAIL_FROM || 'no-reply@higcf.org',
    defaultFromName: 'HIGCF',

    sendEmail: async ({ from, to, cc, subject, html, text }) => {
      const sender = from || process.env.MAIL_FROM || 'HIGCF <no-reply@higcf.org>'

      const ccAddress = cc
        ? Array.isArray(cc)
          ? cc
          : typeof cc === 'string'
            ? cc.split(',').map((s) => s.trim()).filter(Boolean)
            : undefined
        : undefined

      const { error } = await resend.emails.send({
        from: sender,
        to: Array.isArray(to) ? to : [to as string],
        ...(ccAddress && ccAddress.length > 0 ? { cc: ccAddress } : {}),
        subject,
        html: html ?? undefined,
        text: text ?? undefined,
      })

      if (error) {
        throw new Error(`Resend error: ${error.message}`)
      }
    },
  }
}

export default resendAdapter
