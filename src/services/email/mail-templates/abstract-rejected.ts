import { Abstract, Post, User } from '@/payload-types'

export const abstractRejectedMail = (abstract: Abstract) => `
<!doctype html>
<html>
<body style="margin:0; padding:0; background:#f6f8fb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; width:100%; max-width:600px;">
          
          <!-- Header -->
          <tr>
            <td style="padding:20px; border-bottom:1px solid #f0f4fa;">
              <table role="presentation" width="100%">
                <tr>
                  <td width="48" style="background:#fff4f4; border-radius:8px; text-align:center; color:#b02a37; font-family:Arial; font-weight:bold;">
                    X
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0; font-size:18px; font-family:Arial; color:#0b2545;">Abstract Decision</p>
                    <p style="margin:2px 0 0; font-size:13px; color:#7a8aa6; font-family:Arial;">${(abstract.conference as Post).title}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px; font-family:Arial; font-size:15px; color:#0b2545; line-height:1.5;">
              <p>Hi <strong>${(abstract.submitter as User)?.fullname ?? (abstract as any).submitterName ?? 'Researcher'}</strong>,</p>
              <p>Thank you for submitting <strong>${abstract.title}</strong>. After careful review, we regret to inform you that your abstract was not accepted.</p>

              <table role="presentation" width="100%" style="background:#fff6f6; border:1px solid #ffecec; border-radius:8px; padding:14px;">
                <tr>
                  <td style="color:#8a1b22; font-family:Arial; font-size:15px; padding:10px">
                    <strong>Reason:</strong> REASON:.....
                  </td>
                </tr>
              </table>



              <p style="text-align:center; margin:20px;">
                <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/abstracts/${abstract.id}" style="background:#0b57b7; color:#ffffff; padding:10px 16px; text-decoration:none; border-radius:6px; font-weight:bold; font-family:Arial;">View Submission</a>
              </p>
              
              <p>
                We appreciate the time and effort you put into your submission and encourage you to submit again in the future.  
              </p>
              
              <p>If you would like feedback or guidance for future submissions, please contact <a href="mailto:${process.env.MAIL_HOST}" style="color:#0b57b7;">${process.env.MAIL_HOST}</a>.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 24px; border-top:1px solid #f0f4fa; font-family:Arial; font-size:13px; color:#7a8aa6;">
              Thank you for your interest in ${(abstract.conference as Post).title}.<br>
              HIGCF · <a href="mailto:${process.env.MAIL_HOST}" style="color:#0b57b7;">${process.env.MAIL_HOST}</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`
