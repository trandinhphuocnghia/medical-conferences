import { Abstract, Post, User } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'

export const abstractCreateMail = (abstract: Abstract) => `
<!doctype html>
<html>
<body style="margin:0; padding:0; background:#f5f7fb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb; padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; overflow:hidden; width:100%; max-width:600px;">
          
          <!-- Header -->
          <tr>
            <td style="padding:20px 24px; border-bottom:1px solid #eef3fb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48" style="background:#e9f1ff; border-radius:8px; text-align:center; font-weight:bold; color:#0b57b7; font-family:Arial; font-size:16px; padding:8px">
                    LOGO
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0; font-size:18px; font-family:Arial; color:#0b2545;">Abstract Submission Received</p>
                    <p style="margin:2px 0 0; font-size:13px; font-family:Arial; color:#7a8aa6;">${(abstract.conference as Post).title}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px; font-family:Arial; font-size:15px; color:#0b2545; line-height:1.5;">
              <p>Hi <strong>${(abstract.submitter as User)?.fullname ?? (abstract as any).submitterName ?? 'Researcher'}</strong>,</p>
              <p>Thank you for your submission. We have successfully received your abstract titled:</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fbff; border:1px solid #eef6ff; border-radius:8px; padding:16px;">
                <tr>
                  <td style="font-family:Arial; font-size:15px; padding:16px">
                    <strong>${abstract.title}</strong>
                    <div style="margin-top:4px; font-size:13px; color:#556b8a;">
                      Submitted on: ${formatDateTime(abstract.createdAt)}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="text-align:center; margin:20px;">
                <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/collections/abstracts/${abstract.id}" style="background:#0b57b7; color:#ffffff; padding:10px 16px; text-decoration:none; border-radius:6px; font-weight:bold; font-family:Arial;">View Submission</a>
              </p>

              <p style="font-size:13px; color:#556b8a;">Questions? Contact: 
                <a href="mailto:${process.env.MAIL_HOST}" style="color:#0b57b7;">${process.env.MAIL_HOST}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 24px; background:#ffffff; border-top:1px solid #f0f4fa; font-family:Arial; font-size:13px; color:#7a8aa6;">
              MedConf<br/>
              If this wasn’t you, contact <a href="mailto:${process.env.MAIL_HOST}" style="color:#0b57b7;">${process.env.MAIL_HOST}</a>.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`
