'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function sendTestEmail() {
  const payload = await getPayload({ config: configPromise })
  try {
    const info = await payload.sendEmail({
      to: 'nghia.bui@sungrove.co.jp',
      subject: '✅ Test Email from Payload + Next.js',
      html: `<p>Hello!</p><p>This is a test email from PayloadCMS using Gmail SMTP 🎉</p>`,
      text: `This is a test email from PayloadCMS using Gmail SMTP.`,
    })

    console.log('✅ Email sent:', info)
    return { success: true }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error: (error as Error).message }
  }
}
