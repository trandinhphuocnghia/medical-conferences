import { z } from 'zod'

/* ─────────────────────────────────────────────────────────────────────────────
 * i18n-aware schema factory
 * Zod schemas live at module level, outside React components, so they cannot
 * call `useTranslations()` directly. The solution is to export a factory
 * `createApplicationFormSchema(t)` that builds the schema with translated
 * strings at runtime, called from the component that holds the `t` function.
 
 * For TypeScript type inference (ApplicationFormValues) we use message-free
 * static shapes (the *Shape constants below) — message strings do not affect
 * the inferred output type, so there is no duplication risk.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * The type of the scoped translator passed to schema factories.
 * Callers: `useTranslations('CourseApplication')` — keys are namespaced
 * relative to 'CourseApplication', e.g. `t('validation.emailRequired')`.
 */
export type SchemaTranslator = (key: string) => string

/* ─────────────────────────────────────────────────────────────────────────────
 * Static shapes — used for TypeScript type inference ONLY.
 * Do NOT use these shapes for runtime Zod validation in the browser; use the
 * factories below instead so users see their locale's error messages.
 * ──────────────────────────────────────────────────────────────────────────── */
const personalInfoShape = z.object({
  first_name:       z.string().min(1).max(100),
  last_name:        z.string().min(1).max(100),
  date_of_birth:    z.string().min(1),
  specialization:   z.string().max(200).optional(),
  email:            z.string().email(),
  phone:            z.string().min(7).max(20).regex(/^[+]?[\d\s\-()]+$/),
  has_organization: z.boolean().default(false),
  organization:     z.string().max(255).optional(),
})

const shortCourseShape = z.object({
  enrollment_type:      z.literal('short_course'),
  preferred_duration:   z.string().max(100).optional(),
  preferred_content:    z.string().max(1000).optional(),
  preferred_start_date: z.string().optional(),
  preferred_end_date:   z.string().optional(),
})

const postgraduateShape = z.object({
  enrollment_type:    z.literal('postgraduate'),
  academic_level:     z.enum(['master', 'resident', 'phd']),
  entrance_exam_passed: z.boolean().default(false),
  research_start_month: z.string().optional(),
  research_end_month:   z.string().optional(),
})

// ── Static discriminated union (type inference only) ──────────────────────────
const _staticSchema = z.discriminatedUnion('enrollment_type', [
  personalInfoShape.merge(shortCourseShape),
  personalInfoShape.merge(postgraduateShape),
])

/** Full form value type — derived from message-free static shapes. */
export type ApplicationFormValues = z.infer<typeof _staticSchema>

/* ─────────────────────────────────────────────────────────────────────────────
 * i18n schema factories
 *
 * Each factory accepts the scoped translator `t` and returns a Zod schema
 * whose error messages come from the 'CourseApplication.validation' namespace.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Step 1 — Personal Information (plain ZodObject, supports .merge()) */
export function createPersonalInfoShape(t: SchemaTranslator) {
  return z.object({
    first_name: z
      .string({ required_error: t('validation.firstNameRequired') })
      .min(1, t('validation.firstNameRequired'))
      .max(100, t('validation.firstNameMax')),

    last_name: z
      .string({ required_error: t('validation.lastNameRequired') })
      .min(1, t('validation.lastNameRequired'))
      .max(100, t('validation.lastNameMax')),

    date_of_birth: z
      .string({ required_error: t('validation.dateOfBirthRequired') })
      .min(1, t('validation.dateOfBirthRequired')),

    specialization: z
      .string()
      .max(200, t('validation.specializationMax'))
      .optional(),

    email: z
      .string({ required_error: t('validation.emailRequired') })
      .email(t('validation.emailInvalid')),

    phone: z
      .string({ required_error: t('validation.phoneRequired') })
      .min(7, t('validation.phoneMin'))
      .max(20, t('validation.phoneMax'))
      .regex(/^[+]?[\d\s\-()]+$/, t('validation.phoneInvalid')),

    has_organization: z.boolean().default(false),

    organization: z
      .string()
      .max(255, t('validation.organizationMax'))
      .optional(),
  })
}

/** Enrollment type discriminator */
export function createEnrollmentTypeSchema(t: SchemaTranslator) {
  return z.object({
    enrollment_type: z.enum(['short_course', 'postgraduate'], {
      required_error:    t('validation.enrollmentTypeRequired'),
      invalid_type_error: t('validation.enrollmentTypeInvalid'),
    }),
  })
}

/** Step 2a — Short Course (plain ZodObject, supports .merge()) */
export function createShortCourseShape(t: SchemaTranslator) {
  return z.object({
    enrollment_type: z.literal('short_course'),

    preferred_duration: z
      .string()
      .max(100, t('validation.durationMax'))
      .optional(),

    preferred_content: z
      .string()
      .max(1000, t('validation.contentMax'))
      .optional(),

    preferred_start_date: z.string().optional(),
    preferred_end_date:   z.string().optional(),
  })
}

/** Step 2a — Short Course refined (adds date cross-check) */
export function createShortCourseSchema(t: SchemaTranslator) {
  return createShortCourseShape(t).refine(
    (data) => {
      if (data.preferred_start_date && data.preferred_end_date) {
        return new Date(data.preferred_end_date) > new Date(data.preferred_start_date)
      }
      return true
    },
    {
      message: t('validation.endDateAfterStart'),
      path: ['preferred_end_date'],
    },
  )
}

/** Step 2b — Postgraduate Program (plain ZodObject, supports .merge()) */
export function createPostgraduateShape(t: SchemaTranslator) {
  return z.object({
    enrollment_type: z.literal('postgraduate'),

    academic_level: z.enum(['master', 'resident', 'phd'], {
      required_error:    t('validation.academicLevelRequired'),
      invalid_type_error: t('validation.academicLevelInvalid'),
    }),

    entrance_exam_passed: z.boolean().default(false),

    research_start_month: z.string().optional(),
    research_end_month:   z.string().optional(),
  })
}

/** Step 2b — Postgraduate refined (adds month cross-check) */
export function createPostgraduateSchema(t: SchemaTranslator) {
  return createPostgraduateShape(t).refine(
    (data) => {
      if (data.research_start_month && data.research_end_month) {
        return new Date(data.research_end_month) > new Date(data.research_start_month)
      }
      return true
    },
    {
      message: t('validation.endMonthAfterStart'),
      path: ['research_end_month'],
    },
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Main factory — full discriminated union with i18n messages
 *
 * Usage in a 'use client' component:
 *
 *   const t = useTranslations('CourseApplication')
 *   const schema = useMemo(() => createApplicationFormSchema(t), [t])
 *   const form = useForm({ resolver: zodResolver(schema), ... })
 * ──────────────────────────────────────────────────────────────────────────── */
export function createApplicationFormSchema(t: SchemaTranslator) {
  return z
    .discriminatedUnion('enrollment_type', [
      createPersonalInfoShape(t).merge(createShortCourseShape(t)),
      createPersonalInfoShape(t).merge(createPostgraduateShape(t)),
    ])
    .superRefine((data, ctx) => {
      // Cross-field: organization is required when has_organization is true.
      // Must live here (on the union) so it runs against the fully merged shape
      // — it would be unreachable inside createPersonalInfoShape because that
      // shape is consumed by .merge() before the union is constructed.
      if (data.has_organization && (!data.organization || data.organization.trim().length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.organizationRequired'),
          path: ['organization'],
        })
      }
    })
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Step 1 field list for partial validation via form.trigger()
 * ──────────────────────────────────────────────────────────────────────────── */
export const STEP_1_FIELDS: string[] = [
  'first_name',
  'last_name',
  'date_of_birth',
  'email',
  'phone',
  'has_organization',
  'organization',
] satisfies (keyof z.infer<typeof personalInfoShape>)[]
