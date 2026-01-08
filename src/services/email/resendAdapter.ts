import { resendAdapter } from '@payloadcms/email-resend'

const emailWithResendAdapter = resendAdapter({
  defaultFromAddress: 'dev@payloadcms.com', //TODO: need to created.
  defaultFromName: 'Medconf',
  apiKey: process.env.RESEND_API_KEY || '',
})

export default emailWithResendAdapter
