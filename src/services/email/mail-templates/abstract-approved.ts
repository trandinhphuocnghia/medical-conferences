import { Abstract, Post, User } from '@/payload-types'

export const abstractApprovedMail = (abstract: Abstract) => `
<!doctype html>
<html>
<body style="margin:0; padding:0; background:#f3f9f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; width:100%; max-width:600px;">
          
          <!-- Header -->
          <tr>
            <td style="padding:20px; border-bottom:1px solid #eff7f3;">
              <table role="presentation" width="100%">
                <tr>
                  <td width="48" style="background:#e9fbf3; border-radius:8px; text-align:center; color:#05986a; font-family:Arial; font-weight:bold;">
                    ✓
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0; font-size:18px; font-family:Arial; color:#073b2e;">Abstract Accepted</p>
                    <p style="margin:2px 0 0; font-size:13px; font-family:Arial; color:#6b8f7f;">${(abstract.conference as Post).title}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px; font-family:Arial; font-size:15px; color:#073b2e; line-height:1.5;">
              <p>Congratulations <strong>${(abstract.submitter as User).fullname}</strong>!</p>
              <p>Your abstract <strong>"${abstract.title}"</strong> has been has been approved for the upcoming event.</p>
              <p style="text-align:center; margin:20px;">
                <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/abstracts/${abstract.id}" style="background:#05986a; color:#ffffff; padding:10px 16px; text-decoration:none; border-radius:6px; font-weight:bold; font-family:Arial;">View Accepted Submission</a>
              </p>

              <p style="font-size:13px; color:#6b8f7f;">If you have any questions, contact <a href="mailto:${process.env.MAIL_HOST}" style="color:#05986a;">${process.env.MAIL_HOST}</a>.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 24px; border-top:1px solid #eef7f2; font-family:Arial; font-size:13px; color:#6b8f7f;">
              MedConf<br/>
              We look forward to your participation.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`
