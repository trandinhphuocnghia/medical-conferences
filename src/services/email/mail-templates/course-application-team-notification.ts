import type { CourseApplication } from '@/payload-types'

const ENROLLMENT_TYPE_LABELS: Record<CourseApplication['enrollment_type'], string> = {
  short_course: 'Short Course',
  postgraduate: 'Postgraduate Program',
}

export function courseApplicationTeamNotificationMail(
  doc: CourseApplication,
  courseTitle: string,
): string {
  const applicantName = `${doc.first_name ?? ''} ${doc.last_name ?? ''}`.trim() || 'Applicant'
  const enrollmentLabel = ENROLLMENT_TYPE_LABELS[doc.enrollment_type] ?? doc.enrollment_type
  const submissionDate = doc.createdAt
    ? new Date(doc.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString()

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
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="width: 100%; background-color: #f8fafc; padding: 32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0"
          style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 10px;
                 overflow: hidden; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);">

          <!-- Header -->
          <tr>
            <td style="padding: 24px; border-bottom: 1px solid #e2e8f0; background-color: #0f172a;">
              <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">
                New Course Application Received
              </p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">
                HIGCF Medical Training Centre Notification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 20px; font-size: 15px; color: #0f172a; line-height: 1.6;">
                A new application has been submitted for <strong>${courseTitle}</strong>.
              </p>

              <!-- Application details table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 0 0 20px; padding: 16px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b; width: 140px;"><strong>Course:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${courseTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Applicant:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${applicantName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Email:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;"><a href="mailto:${doc.email}">${doc.email}</a></td>
                </tr>
                ${
                  doc.phone
                    ? `<tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Phone:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${doc.phone}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Enrollment Type:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${enrollmentLabel}</td>
                </tr>
                ${
                  doc.specialization
                    ? `<tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Specialization:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${doc.specialization}</td>
                </tr>`
                    : ''
                }
                ${
                  doc.organization
                    ? `<tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Organization:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${doc.organization}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Submission Date:</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${submissionDate}</td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Please log in to the admin panel to review and manage this application.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                HIGCF Medical Training Centre Automated System
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
