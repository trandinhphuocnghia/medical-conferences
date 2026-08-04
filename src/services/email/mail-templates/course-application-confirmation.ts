import type { CourseApplication } from '@/payload-types'
import { SUPPORT_EMAILS } from '@/services/email/constants'

/* ─────────────────────────────────────────────────────────────────────────────
 * courseApplicationConfirmationMail
 *
 * Sends a professional, medical-tone confirmation email to an applicant
 * immediately after their course application is received. Matches the
 * visual style used by the abstract submission templates.
 * ──────────────────────────────────────────────────────────────────────────── */

const ENROLLMENT_TYPE_LABELS: Record<CourseApplication['enrollment_type'], string> = {
  short_course: 'Short Course',
  postgraduate: 'Postgraduate Program',
}

export function courseApplicationConfirmationMail(
  doc: CourseApplication,
  courseTitle: string,
): string {
  const firstName = doc.first_name ?? 'Applicant'
  const enrollmentLabel = ENROLLMENT_TYPE_LABELS[doc.enrollment_type] ?? doc.enrollment_type

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    }
    table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
    a { text-decoration: none; color: #06b6d4; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 600px !important; }
      .mobile-padding { padding: 16px !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="width: 100%; background-color: #f8fafc; padding: 32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" class="container"
          style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 10px;
                 overflow: hidden; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);">

          <!-- Header -->
          <tr>
            <td style="padding: 24px; border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48" style="padding-right: 14px; vertical-align: middle;">
                    <div style="width: 48px; height: 48px;
                                background: linear-gradient(135deg, #0f172a 0%, #06b6d4 100%);
                                border-radius: 8px; text-align: center; line-height: 48px;
                                font-size: 24px; color: #ffffff;">
                      ✓
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <p style="margin: 0; font-size: 17px; font-weight: 600; color: #0f172a; line-height: 1.3;">
                      Application Received
                    </p>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">
                      HIGCF Medical Training Centre
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px;" class="mobile-padding">

              <!-- Greeting -->
              <p style="margin: 0 0 20px; font-size: 15px; color: #0f172a; line-height: 1.6;">
                Dear <strong>${firstName}</strong>,
              </p>

              <!-- Thank-you line -->
              <p style="margin: 0 0 16px; font-size: 15px; color: #0f172a; line-height: 1.6;">
                Thank you for your application to
                <strong>${courseTitle}</strong>.
              </p>

              <!-- Application detail card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="background-color: #f0f9ff; border: 1px solid #cffafe;
                       border-radius: 8px; margin: 0 0 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 18px;">
                    <p style="margin: 0 0 6px; font-size: 11px; color: #06b6d4; font-weight: 600;
                               letter-spacing: 0.6px; text-transform: uppercase;">
                      Application Details
                    </p>
                    <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.5;">
                      ${courseTitle}
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
                      Enrollment type: ${enrollmentLabel}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Status note -->
              <p style="margin: 0 0 16px; font-size: 15px; color: #0f172a; line-height: 1.6;">
                Your <strong>${enrollmentLabel}</strong> application has been received and is currently
                under review. Our team will contact you at this email address with further details
                regarding the next steps of your application.
              </p>

              <!-- Confirmation note -->
              <div style="background-color: #f8fafc; border-left: 4px solid #06b6d4;
                          padding: 14px 16px; border-radius: 4px; margin: 0 0 24px;">
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
                  Please save this email as confirmation of your application.
                  If you have not received a response within 5 working days, please contact us using
                  the addresses below.
                </p>
              </div>

              <!-- Contact -->
              <p style="margin: 0 0 6px; font-size: 14px; color: #475569; line-height: 1.6;">
                Should you have any inquiries, please contact us via email:
              </p>
              <p style="margin: 0; font-size: 14px; color: #0f172a; line-height: 1.8;">
                ${SUPPORT_EMAILS.map(
                  (email) =>
                    `<a href="mailto:${email}" style="color: #06b6d4; font-weight: 500; display: block;">${email}</a>`,
                ).join('')}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #0f172a;">
                HIGCF Medical Training Centre — Secretariat
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.8;">
                Email:
                ${SUPPORT_EMAILS.map(
                  (email) =>
                    `<a href="mailto:${email}" style="color: #06b6d4; display: block;">${email}</a>`,
                ).join('')}
              </p>
            </td>
          </tr>

          <!-- Copyright -->
          <tr>
            <td style="padding: 14px 28px; background-color: #ffffff;
                       border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                © ${new Date().getFullYear()} HIGCF Medical Training Centre. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
