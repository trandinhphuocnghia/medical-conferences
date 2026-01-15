import { resendAdapter } from '@payloadcms/email-resend'

const emailWithResendAdapter = resendAdapter({
  defaultFromAddress: 'onboarding@resend.dev',
  defaultFromName: 'onboarding',
  apiKey: process.env.RESEND_API_KEY || '',
})

export default emailWithResendAdapter
