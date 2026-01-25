import { google } from 'googleapis'
import { BasePayload, EmailAdapter } from 'payload'

/**
 *
googleapis cons:
- rate limiting: google will block if send more than 50 emails in one second.
- working alongside other services is difficult.
 */
const gmailAdapter: EmailAdapter = ({ payload: _payload }: { payload: BasePayload }) => {
  return {
    name: 'Gmail API Adapter',
    defaultFromAddress: process.env.MAIL_HOST || '',
    defaultFromName: 'Medconf',
    sendEmail: async ({ from, to, subject, text, html }) => {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      )

      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      })

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

      // Build email content
      const emailLines = []

      // Extract just the email address to ensure we can force the Display Name
      let fromAddress = from || process.env.MAIL_HOST || ''
      const emailMatch = fromAddress.match(/<([^>]+)>/)
      if (emailMatch) {
        fromAddress = emailMatch[1]
      }

      emailLines.push(`From: "MedConf" <${fromAddress.trim()}>`)
      emailLines.push(`To: ${to}`)
      emailLines.push(`Subject: ${subject}`)
      emailLines.push('MIME-Version: 1.0')
      emailLines.push('Content-Type: text/html; charset=UTF-8')
      emailLines.push('')
      emailLines.push(html || text || '')

      // Join with CRLF as per MIME standard
      const email = emailLines.join('\r\n')

      // Base64 encode the message
      const encodedMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      // Send email
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      })
    },
  }
}

export default gmailAdapter
