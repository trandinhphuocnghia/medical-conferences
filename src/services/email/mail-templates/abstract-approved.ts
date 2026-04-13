import type { Abstract } from '@/payload-types'
import { SUPPORT_EMAILS } from '@/services/email/constants'
import { resolveConferenceName, resolveSubmitterName } from './utils'

export const abstractApprovedMail = (abstract: Abstract): string => {
  const submitterName = resolveSubmitterName(abstract)
  const conferenceName = resolveConferenceName(abstract)

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; }
    table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
    a { text-decoration: none; color: #059669; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 600px !important; }
      .mobile-padding { padding: 16px !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width: 100%; background-color: #f8fafc; padding: 32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" class="container" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 24px; border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48" style="padding-right: 14px; vertical-align: middle;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-radius: 8px; text-align: center; line-height: 48px; font-size: 24px; color: #ffffff;">✓</div>
                  </td>
                  <td style="vertical-align: middle;">
                    <p style="margin: 0; font-size: 17px; font-weight: 600; color: #064e3b; line-height: 1.3;">Abstract Accepted</p>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">${conferenceName}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px;" class="mobile-padding">
              <p style="margin: 0 0 20px; font-size: 15px; color: #0f172a; line-height: 1.6;">Dear <strong>${submitterName}</strong>,</p>
              <p style="margin: 0 0 16px; font-size: 15px; color: #0f172a; line-height: 1.6;">Congratulations! Your abstract has been approved for presentation at <strong>${conferenceName}</strong>.</p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 8px; margin: 0 0 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 18px;">
                    <p style="margin: 0 0 6px; font-size: 11px; color: #059669; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase;">Accepted Submission</p>
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #064e3b; line-height: 1.5;">${abstract.title}</p>
                  </td>
                </tr>
              </table>

              <p style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${(abstract as any).conferenceSlug || '#'}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">View Official Timeline</a>
              </p>

              <p style="margin: 0 0 6px; font-size: 14px; color: #475569; line-height: 1.6;">Should you have any inquiries regarding the presentation requirements, please contact us:</p>
              <p style="margin: 0; font-size: 14px; color: #0f172a; line-height: 1.8;">
                ${SUPPORT_EMAILS.map((email) => `<a href="mailto:${email}" style="color: #059669; font-weight: 500; display: block;">${email}</a>`).join('')}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #0f172a;">Secretariat of ${conferenceName}</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">HIGCF Scientific Committee</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
