import { resendAdapter } from '@payloadcms/email-resend'

const emailWithResendAdapter = resendAdapter({
  defaultFromAddress: process.env.RESEND_FROM_EMAIL || process.env.MAIL_HOST || 'noreply@example.com',
  defaultFromName: 'HIGCF',
  apiKey: process.env.RESEND_API_KEY || '',
})

export default emailWithResendAdapter
