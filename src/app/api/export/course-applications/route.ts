/**
 * GET /api/export/course-applications?courseId=123
 *
 * Admin-only endpoint — validates the Payload session cookie, then streams
 * an Excel (.xlsx) file containing all applications for the requested course.
 *
 * Dependencies: exceljs (npm install exceljs)
 */
import configPromise from '@payload-config'
import ExcelJS from 'exceljs'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

// ── Value mappings (Vietnamese) ───────────────────────────────────────────────
const enrollmentTypeMap: Record<string, string> = {
  short_course: 'Ngắn hạn',
  postgraduate: 'Sau đại học',
}

const statusMap: Record<string, string> = {
  pending: 'Chờ xử lý',
  contacted: 'Đã liên hệ',
  confirmed: 'Đã xác nhận',
  rejected: 'Từ chối',
}

const academicLevelMap: Record<string, string> = {
  master: 'Thạc sĩ',
  resident: 'Bác sĩ nội trú',
  phd: 'Nghiên cứu sinh',
}

const researchExpMap: Record<string, string> = {
  no_experience: 'Chưa từng',
  undergraduate_thesis: 'Đề tài tốt nghiệp ĐH',
  domestic_publication: 'Đăng báo trong nước',
  international_publication: 'Đăng báo quốc tế',
  rct_experience: 'Kinh nghiệm RCT',
  other: 'Khác',
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
}

function formatMonth(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const courseIdParam = searchParams.get('courseId')

    if (!courseIdParam) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    const courseId = parseInt(courseIdParam, 10)
    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'courseId must be a number' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // ── Auth: validate admin session ──────────────────────────────────────────
    // Payload's meAdmin() reads the same session cookie used by the admin panel
    const { user } = await payload.auth({ headers: req.headers })

    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // ── Fetch course ──────────────────────────────────────────────────────────
    const course = await payload.findByID({
      collection: 'courses',
      id: courseId,
      locale: 'vi',
      depth: 0,
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if ((course as any).course_type !== 'on_demand') {
      return NextResponse.json(
        { error: 'Export chỉ khả dụng cho khoá học đăng ký theo nhu cầu.' },
        { status: 400 },
      )
    }

    // ── Fetch all applications ────────────────────────────────────────────────
    const { docs: applications } = await payload.find({
      collection: 'course-applications',
      where: { course: { equals: courseId } },
      limit: 0,
      depth: 0,
      sort: '-createdAt',
      overrideAccess: true,
    })

    // ── Build Excel workbook ──────────────────────────────────────────────────
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'HIGCF Admin'
    workbook.created = new Date()

    const sheet = workbook.addWorksheet('Danh sách đăng ký', {
      pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
    })

    const TOTAL_COLS = 18 // A through R
    const COL_IDS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R']

    // Set column widths
    const colWidths = [20, 16, 16, 14, 28, 16, 28, 18, 14, 14, 18, 40, 28, 18, 14, 36, 36, 28]
    COL_IDS.forEach((col, i) => {
      sheet.getColumn(i + 1).width = colWidths[i]
    })

    // ── Row 1: Course title (merged, bold, large) ─────────────────────────────
    sheet.mergeCells(`A1:R1`)
    const titleCell = sheet.getCell('A1')
    titleCell.value = course.title
    titleCell.font = { bold: true, size: 14, name: 'Arial' }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(1).height = 28

    // ── Row 2: Export date (merged, italic) ───────────────────────────────────
    sheet.mergeCells(`A2:R2`)
    const today = new Date()
    const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`
    const dateCell = sheet.getCell('A2')
    dateCell.value = `Ngày xuất: ${dateStr}`
    dateCell.font = { italic: true, size: 11, name: 'Arial', color: { argb: 'FF555555' } }
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' }

    // ── Row 3: Spacer ─────────────────────────────────────────────────────────
    // (empty row, already exists)

    // ── Row 4: Column headers ─────────────────────────────────────────────────
    const HEADER_ROW = 4
    const headers = [
      'Mã đơn',
      'Họ',
      'Tên',
      'Ngày sinh',
      'Email',
      'Số điện thoại',
      'Đơn vị công tác',
      'Hình thức đăng ký',
      'Trạng thái',
      'Ngày đăng ký',
      // Short course
      'Thời lượng mong muốn',
      'Nội dung mong muốn',
      'Thời gian dự kiến',
      // Postgraduate
      'Trình độ đề tài',
      'Thi đầu vào',
      'Kinh nghiệm nghiên cứu',
      'Kinh nghiệm khác',
      'Thời gian làm đề tài',
    ]

    const headerRow = sheet.getRow(HEADER_ROW)
    headers.forEach((header, colIdx) => {
      const cell = headerRow.getCell(colIdx + 1)
      cell.value = header
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 10 }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1a365d' },
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF9EB6CC' } },
        left: { style: 'thin', color: { argb: 'FF9EB6CC' } },
        bottom: { style: 'thin', color: { argb: 'FF9EB6CC' } },
        right: { style: 'thin', color: { argb: 'FF9EB6CC' } },
      }
    })
    headerRow.height = 36

    // Enable auto-filter on the header row
    sheet.autoFilter = {
      from: { row: HEADER_ROW, column: 1 },
      to: { row: HEADER_ROW, column: TOTAL_COLS },
    }

    // ── Rows 5+: Data ─────────────────────────────────────────────────────────
    const LIGHT_BG  = 'FFF0F4F8' // even rows
    const WHITE_BG  = 'FFFFFFFF' // odd rows

    applications.forEach((doc: any, idx) => {
      const rowNum = HEADER_ROW + 1 + idx
      const dataRow = sheet.getRow(rowNum)
      const isEven = idx % 2 === 0

      const isShortCourse = doc.enrollment_type === 'short_course'
      const isPostgraduate = doc.enrollment_type === 'postgraduate'

      // Build research_experience label
      const researchLabels: string[] = ((doc.research_experience ?? []) as string[]).map(
        (v) => researchExpMap[v] ?? v,
      )

      const dateRange =
        doc.preferred_start_date && doc.preferred_end_date
          ? `${formatDate(doc.preferred_start_date)} - ${formatDate(doc.preferred_end_date)}`
          : ''

      const monthRange =
        doc.research_start_month && doc.research_end_month
          ? `${formatMonth(doc.research_start_month)} - ${formatMonth(doc.research_end_month)}`
          : ''

      const rowValues = [
        String(doc.id),
        doc.last_name ?? '',
        doc.first_name ?? '',
        formatDate(doc.date_of_birth),
        doc.email ?? '',
        doc.phone ?? '',
        doc.organization ?? 'Không có',
        enrollmentTypeMap[doc.enrollment_type] ?? doc.enrollment_type,
        statusMap[doc.status] ?? doc.status,
        formatDate(doc.createdAt),
        // Short course
        isShortCourse ? (doc.preferred_duration ?? '') : '',
        isShortCourse ? (doc.preferred_content ?? '') : '',
        isShortCourse ? dateRange : '',
        // Postgraduate
        isPostgraduate ? (academicLevelMap[doc.academic_level] ?? doc.academic_level ?? '') : '',
        isPostgraduate ? (doc.entrance_exam_passed ? 'Đã đậu' : 'Chưa') : '',
        isPostgraduate ? researchLabels.join(', ') : '',
        isPostgraduate ? (doc.research_experience_other ?? '') : '',
        isPostgraduate ? monthRange : '',
      ]

      rowValues.forEach((val, colIdx) => {
        const cell = dataRow.getCell(colIdx + 1)
        cell.value = val
        cell.font = { name: 'Arial', size: 10 }
        cell.alignment = { vertical: 'middle', wrapText: true }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isEven ? LIGHT_BG : WHITE_BG },
        }
        cell.border = {
          top: { style: 'hair', color: { argb: 'FFD1D9E0' } },
          left: { style: 'hair', color: { argb: 'FFD1D9E0' } },
          bottom: { style: 'hair', color: { argb: 'FFD1D9E0' } },
          right: { style: 'hair', color: { argb: 'FFD1D9E0' } },
        }
      })

      dataRow.height = 20
    })

    // ── Freeze header rows ────────────────────────────────────────────────────
    sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: HEADER_ROW, showGridLines: true }]

    // ── Write to buffer ───────────────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer()

    // ── Build filename ────────────────────────────────────────────────────────
    const safeTitle = sanitizeFilename(course.title)
    const fileDate = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`
    const filename = `${safeTitle}_danh-sach-dang-ky_${fileDate}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[ExportCourseApplications] Error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
