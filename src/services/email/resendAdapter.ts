import { resendAdapter } from '@payloadcms/email-resend'

const emailWithResendAdapter = resendAdapter({
  defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'no-reply@higcf.org',
  defaultFromName: 'HIGCF',
  apiKey: process.env.RESEND_API_KEY || '',
})

export default emailWithResendAdapter
