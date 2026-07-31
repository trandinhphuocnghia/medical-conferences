import { CollectionBeforeValidateHook, CollectionConfig, ValidationError } from 'payload'

import { adminOnly, adminOrModifier, anyone } from '@/access/collectionAccess'

/* ─────────────────────────────────────────────────────────────────────────────
 * Duplicate-application guard
 * ─────────────────────────────────────────────────────────────────────────────
 * Blocks a new submission when the same email already has an active application
 * (pending | contacted | confirmed) for the same course.
 * Rejected applications are intentionally excluded so users may re-apply after
 * rejection without being locked out.
 * ──────────────────────────────────────────────────────────────────────────── */
const preventDuplicateApplication: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  const id = req.routeParams?.id
  if (!data) return data

  const email = data.email
  const courseId =
    typeof data.course === 'object' && data.course !== null ? data.course.id : data.course

  // Only validate when the fields we need are actually present
  if (!email || !courseId) return data

  const activeStatuses = ['pending', 'contacted', 'confirmed']

  const existing = await req.payload.find({
    collection: 'course-applications',
    where: {
      email: { equals: email },
      course: { equals: courseId },
      status: { in: activeStatuses },
    },
    limit: 1,
    depth: 0,
  })

  // On update, exclude the document being edited so it doesn't conflict with itself
  const conflictingDocs =
    operation === 'update'
      ? existing.docs.filter((doc) => String(doc.id) !== String(id))
      : existing.docs

  if (conflictingDocs.length > 0) {
    throw new ValidationError({
      collection: 'course-applications',
      errors: [
        {
          path: 'email',
          message:
            'Email này đã được sử dụng để đăng ký khóa học này và đang chờ xử lý.',//TODO: apply next-intl later.
        },
      ],
    })
  }

  return data
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CourseApplications Collection
 * ─────────────────────────────────────────────────────────────────────────────
 * Stores public user registrations/applications for medical training courses.
 *
 * Key design decisions:
 *   • `create` is open to `anyone` — no login required for the public form.
 *   • `user` field is optional; it links an application to an existing account
 *     when the applicant is already registered on the platform.
 *   • Conditional fields are driven by `enrollment_type` (short_course vs
 *     postgraduate) so the admin form and any future public form both surface
 *     only the fields that are relevant.
 *   • A `beforeValidate` hook deduplicates applications per (email + course)
 *     while intentionally allowing re-application after rejection.
 * ──────────────────────────────────────────────────────────────────────────── */
export const CourseApplications: CollectionConfig = {
  slug: 'course-applications',

  /* ── Access Control ──────────────────────────────────────────────────── */
  access: {
    admin: (args) => Boolean(adminOrModifier(args)),
    create: anyone,
    read: adminOrModifier,
    update: adminOrModifier,
    delete: adminOnly,
  },

  /* ── Admin UI ────────────────────────────────────────────────────────── */
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'course', 'enrollment_type', 'status', 'createdAt'],
    description: 'Manages public course registration applications submitted via the website.',
  },

  /* ── Lifecycle Hooks ─────────────────────────────────────────────────── */
  hooks: {
    beforeValidate: [preventDuplicateApplication],
  },

  /* ── Timestamps & Trash ──────────────────────────────────────────────── */
  timestamps: true,
  trash: true,

  /* ── Fields ──────────────────────────────────────────────────────────── */
  fields: [
    // ─── Core Relations ───────────────────────────────────────────────────

    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
      admin: {
        description: 'The training course this application is submitted for.',
      },
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Linked Account',
      admin: {
        position: 'sidebar',
        description: 'Link to an existing platform account if the applicant is a registered user.',
      },
    },

    // ─── Application Status ───────────────────────────────────────────────

    {
      name: 'status',
      type: 'select',
      label: 'Application Status',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Current processing status of this application.',
      },
    },

    // ─── Tabbed Fields ────────────────────────────────────────────────────

    {
      type: 'tabs',
      tabs: [
        /* ──────────────────────────────────────────────────────────────────
         * TAB 1: Personal Information
         * ──────────────────────────────────────────────────────────────── */
        {
          label: 'Personal Information',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'first_name',
                  type: 'text',
                  label: 'First Name',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'last_name',
                  type: 'text',
                  label: 'Last Name',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },

            {
              name: 'date_of_birth',
              type: 'date',
              label: 'Date of Birth',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayOnly' },
              },
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email Address',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone Number',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },

            {
              name: 'specialization',
              type: 'text',
              label: 'Medical Specialization',
              required: false,
              admin: {
                description: 'e.g. Gastroenterology, General Surgery.',
              },
            },

            {
              name: 'has_organization',
              type: 'checkbox',
              label: 'Affiliated with an Organization / Hospital?',
              defaultValue: false,
            },

            {
              name: 'organization',
              type: 'text',
              label: 'Organization / Hospital',
              required: false,
              validate: (value: string | null | undefined, { data }: { data: Record<string, any> }) => {
                if (data?.has_organization && !value) {
                  return 'Organization name is required when affiliated with an institution.'
                }
                return true
              },
              admin: {
                condition: (data) => data?.has_organization === true,
                description: 'Name of the affiliated hospital or institution.',
              },
            },
          ],
        },

        /* ──────────────────────────────────────────────────────────────────
         * TAB 2: Enrollment Details
         * ──────────────────────────────────────────────────────────────── */
        {
          label: 'Enrollment Details',
          fields: [
            {
              name: 'enrollment_type',
              type: 'select',
              label: 'Enrollment Type',
              required: true,
              options: [
                { label: 'Short Course', value: 'short_course' },
                { label: 'Postgraduate Program', value: 'postgraduate' },
              ],
              admin: {
                description: 'Select the program type the applicant is applying for.',
              },
            },

            // ── Short Course Fields ─────────────────────────────────────
            {
              name: 'preferred_duration',
              type: 'text',
              label: 'Preferred Duration',
              admin: {
                condition: (data) => data?.enrollment_type === 'short_course',
                description: 'e.g. "3 days", "1 week".',
              },
            },

            {
              name: 'preferred_content',
              type: 'textarea',
              label: 'Preferred Content / Topics',
              admin: {
                condition: (data) => data?.enrollment_type === 'short_course',
                description: 'Describe the specific clinical skills or topics the applicant wants to focus on.',
              },
            },

            {
              type: 'row',
              admin: {
                condition: (data) => data?.enrollment_type === 'short_course',
              },
              fields: [
                {
                  name: 'preferred_start_date',
                  type: 'date',
                  label: 'Preferred Start Date',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
                {
                  name: 'preferred_end_date',
                  type: 'date',
                  label: 'Preferred End Date',
                  validate: (value: Date | string | null | undefined, { data }: { data: Record<string, any> }) => {
                    if (data?.preferred_start_date && value) {
                      if (new Date(value) <= new Date(data.preferred_start_date)) {
                        return 'End date must be after start date.'
                      }
                    }
                    return true
                  },
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
              ],
            },

            // ── Postgraduate Program Fields ─────────────────────────────
            {
              name: 'academic_level',
              type: 'select',
              label: 'Academic Level',
              options: [
                { label: "Master's Student", value: 'master' },
                { label: 'Resident / Clinical Fellow', value: 'resident' },
                { label: 'PhD Candidate', value: 'phd' },
              ],
              validate: (value: string | null | undefined, { data }: { data: Record<string, any> }) => {
                if (data?.enrollment_type === 'postgraduate' && !value) {
                  return 'Academic level is required for postgraduate applications.'
                }
                return true
              },
              admin: {
                condition: (data) => data?.enrollment_type === 'postgraduate',
                description: 'Current academic or training level of the applicant.',
              },
            },

            {
              name: 'entrance_exam_passed',
              type: 'checkbox',
              label: 'Entrance Examination Passed',
              admin: {
                condition: (data) => data?.enrollment_type === 'postgraduate',
                description: 'Check if the applicant has passed the required entrance examination.',
              },
            },

            {
              type: 'row',
              admin: {
                condition: (data) => data?.enrollment_type === 'postgraduate',
              },
              fields: [
                {
                  name: 'research_start_month',
                  type: 'date',
                  label: 'Research Start Month',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'monthOnly' },
                  },
                },
                {
                  name: 'research_end_month',
                  type: 'date',
                  label: 'Research End Month (Expected)',
                  validate: (value: Date | string | null | undefined, { data }: { data: Record<string, any> }) => {
                    if (data?.research_start_month && value) {
                      if (new Date(value) <= new Date(data.research_start_month)) {
                        return 'End month must be after start month.'
                      }
                    }
                    return true
                  },
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'monthOnly' },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
