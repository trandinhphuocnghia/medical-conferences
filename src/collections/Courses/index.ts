import type { CollectionConfig } from 'payload'

import { adminOrModifier, adminOrOwner, anyone, authenticated } from '@/access/collectionAccess'
import { userView } from '@/access/collectionView'
import { bioLexical } from '@/fields/bioLexical'
import { slugField } from '@/fields/slug'
import { author } from '@/utilities/collectionAuthor'

/* ─────────────────────────────────────────────────────────────────────────────
 * Courses Collection — Master-Child Architecture (Refined UI)
 * ──────────────────────────────────────────────────────────────────────────
 *
 * A **Course** is the master entity describing what is taught.
 * It contains batches (schedules), standard medical curriculum details,
 * logistics information, and tenancy scoping.
 *
 * Polymorphism:
 *   `course_type` drives conditional rendering:
 *     • "fixed"     → shows tuition, capacity, schedules, curriculum
 *     • "on_demand" → shows custom training content for bespoke programs
 *
 * Scopes:
 *   `managing_group` restricts available instructors to members of the group.
 * ────────────────────────────────────────────────────────────────────────── */

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: {
    singular: 'Course',
    plural: 'Courses',
  },

  /* ── Access Control ──────────────────────────────────────────────────── */
  access: {
    admin: authenticated,
    create: adminOrModifier,
    delete: adminOrOwner,
    read: anyone,
    update: adminOrOwner,
  },

  /* ── Admin UI ────────────────────────────────────────────────────────── */
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course_type', 'active', 'updatedAt'],
    hidden: userView,
  },

  /* ── Fields ──────────────────────────────────────────────────────────── */
  fields: [
    // ─── Header / Root Fields (always visible) ───────────────────────────

    {
      name: 'title',
      type: 'text',
      label: 'Course Title',
      required: true,
      admin: {
        description: 'Official name of the course (e.g., "Advanced Laparoscopic Surgery").',
      },
      localized: true,
    },

    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Set to true when the course is publicly visible.',
      },
    },

    {
      name: 'managing_group',
      type: 'relationship',
      relationTo: 'user-groups',
      required: true,
      label: 'Managing Organization',
      admin: {
        position: 'sidebar',
        description:
          'The organization responsible for this course. Instructors will be scoped to members of this group.',
      },
    },

    {
      name: 'course_type',
      type: 'select',
      label: 'Course Type',
      required: true,
      defaultValue: 'fixed',
      options: [
        { label: 'Scheduled Course', value: 'fixed' },
        { label: 'On-demand Course', value: 'on_demand' },
      ],
      admin: {
        position: 'sidebar',
        description:
          '"Scheduled" courses have a predefined schedule & curriculum. "On-Demand" courses are custom-tailored.',
      },
    },

    {
      name: 'base_tuition_fee',
      type: 'number',
      label: 'Base Tuition Fee (VND)',
      required: false,
      min: 0,
      admin: {
        condition: (data) => data?.course_type === 'fixed',
        description: 'Course fee in Vietnamese Dong. Required for fixed curriculum courses.',
        placeholder: 'e.g., 5000000',
      },
      validate: (value: number | null | undefined, { data }: { data: Record<string, any> }) => {
        if (data?.course_type === 'fixed') {
          if (value === undefined || value === null) {
            return 'Base tuition fee is required for fixed curriculum courses.'
          }
          if (value < 0) {
            return 'Tuition fee cannot be negative.'
          }
        }
        return true
      },
    },

    // ─── Tabbed Content ──────────────────────────────────────────────────

    {
      type: 'tabs',
      tabs: [
        /* ────────────────────────────────────────────────────────────────
         * TAB 1: General Information
         * ──────────────────────────────────────────────────────────────── */
        {
          label: 'General Information',
          fields: [
            {
              name: 'target_audience',
              type: 'textarea',
              label: 'Target Audience',
              admin: {
                description: 'Who is this course designed for? (e.g., Gastroenterologists).',
              },
            },
            {
              name: 'objectives',
              type: 'richText',
              label: 'Learning Objectives',
              editor: bioLexical,
              admin: {
                description: 'Detailed learning outcomes participants can expect.',
              },
            },
            {
              name: 'registration_url',
              type: 'text',
              label: 'Registration URL',
              required: false,
              validate: (
                value: string | null | undefined,
                { data }: { data: Record<string, any> },
              ) => {
                if (data?.course_type === 'fixed') {
                  if (!value || value.trim() === '') {
                    return 'Registration URL is required for fixed courses.'
                  }
                  try {
                    new URL(value)
                  } catch {
                    return 'Please enter a valid URL (e.g., https://example.com/register).'
                  }
                } else if (value && value.trim() !== '') {
                  // If a value IS provided for non-fixed courses, still validate format
                  try {
                    new URL(value)
                  } catch {
                    return 'Please enter a valid URL (e.g., https://example.com/register).'
                  }
                }
                return true
              },
              admin: {
                condition: (data) => data?.course_type === 'fixed',
                description: 'External link for course registration. Required for fixed courses.',
                placeholder: 'https://example.com/register',
              },
            },
            {
              name: 'prospectus',
              type: 'upload',
              relationTo: 'files',
              label: 'Tài liệu khóa học / Brochure (PDF)',
              admin: {
                description: 'Tải lên file PDF giới thiệu chi tiết chương trình học.',
              },
            },
            {
              name: 'notification_emails',
              type: 'array',
              label: 'Notification Emails',
              maxRows: 5,
              admin: {
                description:
                  'Email addresses to notify when a new application is submitted. First email = TO, rest = CC.',
                condition: (data) => data?.course_type === 'on_demand',
              },
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  label: 'Email Address',
                },
              ],
            },
          ],
        },

        /* ────────────────────────────────────────────────────────────────
         * TAB 2: Fixed Course Details
         * Only shown when course_type === 'fixed'
         * ──────────────────────────────────────────────────────────────── */
        {
          label: 'Fixed Course Details',
          admin: {
            condition: (data) => data?.course_type === 'fixed',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'min_students',
                  type: 'number',
                  label: 'Min Students',
                  min: 1,
                  admin: {
                    width: '50%',
                    description: 'Minimum enrollment to run a batch.',
                  },
                },
                {
                  name: 'max_students',
                  type: 'number',
                  label: 'Max Students',
                  min: 1,
                  admin: {
                    width: '50%',
                    description: 'Maximum capacity per batch.',
                  },
                },
              ],
            },

            // ── Schedules (Specific Batches) ─────────────────────────────
            {
              name: 'schedules',
              type: 'array',
              label: 'Batches / Schedules',
              admin: {
                initCollapsed: true,
                description: 'List of specific scheduled runs/batches for this course.',
              },
              fields: [
                {
                  name: 'batch_name',
                  type: 'text',
                  label: 'Batch Name',
                  required: true,
                  admin: {
                    placeholder: 'e.g., Batch 1 - Fall 2026',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'start_date',
                      type: 'date',
                      label: 'Start Date',
                      required: true,
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'dayOnly' },
                      },
                    },
                    {
                      name: 'end_date',
                      type: 'date',
                      label: 'End Date',
                      required: true,
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'dayOnly' },
                      },
                    },
                  ],
                },
                {
                  name: 'tuition_fee_override',
                  type: 'number',
                  label: 'Tuition Fee Override (VND)',
                  min: 0,
                  admin: {
                    description: 'Optional override of the base tuition fee for this specific batch.',
                    placeholder: 'e.g., 4500000',
                  },
                },
              ],
            },

            // ── Curriculum Array (Medical Standard Formatting) ───────────
            {
              name: 'curriculum',
              type: 'array',
              label: 'Curriculum Modules',
              admin: {
                initCollapsed: true,
                description: 'Define the course modules and CME hours in order.',
              },
              fields: [
                {
                  name: 'module_title',
                  type: 'text',
                  label: 'Module Title',
                  required: true,
                  admin: {
                    placeholder: 'e.g., Module 1: Introduction to ESD',
                  },
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: 'Module Description',
                  editor: bioLexical,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'theory_hours',
                      type: 'number',
                      label: 'Theory Hours',
                      min: 0,
                      defaultValue: 0,
                      admin: {
                        width: '33%',
                        description: 'Lectures and presentations.',
                      },
                    },
                    {
                      name: 'practice_lab_hours',
                      type: 'number',
                      label: 'Practice Lab Hours',
                      min: 0,
                      defaultValue: 0,
                      admin: {
                        width: '33%',
                        description: 'Dry lab/wet lab hands-on sessions.',
                      },
                    },
                    {
                      name: 'practice_clinical_hours',
                      type: 'number',
                      label: 'Practice Clinical Hours',
                      min: 0,
                      defaultValue: 0,
                      admin: {
                        width: '34%',
                        description: 'Live patient/hospital observation.',
                      },
                    },
                  ],
                },
                {
                  name: 'instructors',
                  type: 'relationship',
                  relationTo: 'users',
                  hasMany: true,
                  label: 'Instructors',
                  admin: {
                    description:
                      'Select instructors for this module. Only members of the Managing Organization are shown.',
                  },
                  filterOptions: async ({ req, data }) => {
                    if (data?.managing_group) {
                      try {
                        const groupId =
                          typeof data.managing_group === 'object'
                            ? data.managing_group.id
                            : data.managing_group

                        const group = await req.payload.findByID({
                          collection: 'user-groups',
                          id: groupId,
                          depth: 0,
                        })

                        if (group?.users && group.users.length > 0) {
                          return {
                            id: {
                              in: group.users.map((u: number | { id: number }) =>
                                typeof u === 'object' ? u.id : u,
                              ),
                            },
                          }
                        }
                        return { id: { equals: 0 } }
                      } catch (err) {
                        console.error(
                          '[Courses] Error fetching managing_group in curriculum.instructors filterOptions:',
                          err,
                        )
                      }
                    }
                    return true
                  },
                },
              ],
            },
          ],
        },

        /* ────────────────────────────────────────────────────────────────
         * TAB 3: Logistics & Payment
         * ──────────────────────────────────────────────────────────────── */
        {
          label: 'Logistics & Payment',
          fields: [
            {
              name: 'logistics_info',
              type: 'group',
              label: 'Logistics Information',
              fields: [
                {
                  name: 'certificate_requirements',
                  type: 'richText',
                  label: 'Certificate Requirements',
                  editor: bioLexical,
                  admin: {
                    description: 'Criteria required to receive a completion certificate or CME credits.',
                  },
                },
                {
                  name: 'bank_transfer_details',
                  type: 'richText',
                  label: 'Bank Transfer Details',
                  editor: bioLexical,
                  admin: {
                    description: 'Bank details for registration fee payments.',
                  },
                },
                {
                  name: 'contact_info',
                  type: 'richText',
                  label: 'Contact Info',
                  editor: bioLexical,
                  admin: {
                    description: 'Contact coordinates for the course secretariat (phone, email, office).',
                  },
                },
              ],
            },
          ],
        },

        /* ────────────────────────────────────────────────────────────────
         * TAB 4: On-Demand Course Details
         * Only shown when course_type === 'on_demand'
         * ──────────────────────────────────────────────────────────────── */
        {
          label: 'Custom Training',
          admin: {
            condition: (data) => data?.course_type === 'on_demand',
          },
          fields: [
            {
              name: 'custom_training_content',
              type: 'richText',
              label: 'Custom Training Content',
              editor: bioLexical,
              admin: {
                description: 'Describe the bespoke training program.',
              },
              localized: true,
            },
          ],
        },
      ],
    },

    // ─── Slug & Author (reuse project-wide utilities) ────────────────────
    ...slugField(),
    ...author,
  ],

  /* ── Timestamps & Versioning ─────────────────────────────────────────── */
  timestamps: true,
  trash: true,
}
