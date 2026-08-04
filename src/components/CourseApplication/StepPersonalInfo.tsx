'use client'

import { useTranslations } from 'next-intl'
import type { UseFormReturn } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ApplicationFormValues } from './schema'

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */
interface StepPersonalInfoProps {
  form: UseFormReturn<ApplicationFormValues>
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

/** Tiny wrapper that renders a consistent field label with optional required asterisk. */
function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  )
}

/** Renders the error message paragraph beneath a field. */
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-destructive text-sm mt-1">{message}</p>
}

/* ─────────────────────────────────────────────────────────────────────────────
 * StepPersonalInfo
 * ──────────────────────────────────────────────────────────────────────────── */
export function StepPersonalInfo({ form }: StepPersonalInfoProps) {
  const t = useTranslations('CourseApplication')

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const hasOrganization = watch('has_organization')

  return (
    <div className="space-y-5">

      {/* ── Row: First Name + Last Name ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:gap-4 gap-5">
        {/* First Name */}
        <div className="flex-1 flex flex-col gap-1.5">
          <FieldLabel htmlFor="first_name" required>
            {t('fields.firstName')}
          </FieldLabel>
          <Input
            id="first_name"
            type="text"
            placeholder={t('fields.firstNamePlaceholder')}
            aria-required="true"
            aria-describedby={errors.first_name ? 'first_name_error' : undefined}
            {...register('first_name')}
          />
          <FieldError message={errors.first_name?.message} />
        </div>

        {/* Last Name */}
        <div className="flex-1 flex flex-col gap-1.5">
          <FieldLabel htmlFor="last_name" required>
            {t('fields.lastName')}
          </FieldLabel>
          <Input
            id="last_name"
            type="text"
            placeholder={t('fields.lastNamePlaceholder')}
            aria-required="true"
            aria-describedby={errors.last_name ? 'last_name_error' : undefined}
            {...register('last_name')}
          />
          <FieldError message={errors.last_name?.message} />
        </div>
      </div>

      {/* ── Date of Birth ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="date_of_birth" required>
          {t('fields.dateOfBirth')}
        </FieldLabel>
        {/*
          Native <input type="date"> is intentional — gives the best mobile UX
          (native date picker) without adding a library dependency.
        */}
        <Input
          id="date_of_birth"
          type="date"
          aria-required="true"
          aria-describedby={errors.date_of_birth ? 'date_of_birth_error' : undefined}
          {...register('date_of_birth')}
        />
        <FieldError message={errors.date_of_birth?.message} />
      </div>

      {/* ── Row: Email + Phone ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:gap-4 gap-5">
        {/* Email */}
        <div className="flex-1 flex flex-col gap-1.5">
          <FieldLabel htmlFor="email" required>
            {t('fields.email')}
          </FieldLabel>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t('fields.emailPlaceholder')}
            aria-required="true"
            aria-describedby={errors.email ? 'email_error' : undefined}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* Phone */}
        <div className="flex-1 flex flex-col gap-1.5">
          <FieldLabel htmlFor="phone" required>
            {t('fields.phone')}
          </FieldLabel>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t('fields.phonePlaceholder')}
            aria-required="true"
            aria-describedby={errors.phone ? 'phone_error' : undefined}
            {...register('phone')}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      {/* ── Has Organisation — Checkbox ───────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Checkbox
            id="has_organization"
            checked={hasOrganization}
            onCheckedChange={(checked) => {
              // Checkbox uses Radix's CheckedState (true | false | 'indeterminate')
              setValue('has_organization', checked === true, { shouldValidate: true })
            }}
          />
          <Label
            htmlFor="has_organization"
            className="text-sm font-medium text-foreground cursor-pointer leading-snug"
          >
            {t('fields.hasOrganization')}
          </Label>
        </div>

        {/* ── Organisation Name — slide-down conditional field ─────────── */}
        <div
          className={[
            'overflow-hidden transition-all duration-300',
            hasOrganization ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
          aria-hidden={!hasOrganization}
        >
          <div className="flex flex-col gap-1.5 pt-1">
            <FieldLabel htmlFor="organization" required>
              {t('fields.organization')}
            </FieldLabel>
            <Input
              id="organization"
              type="text"
              placeholder={t('fields.organizationPlaceholder')}
              aria-required={hasOrganization}
              aria-describedby={errors.organization ? 'organization_error' : undefined}
              {...register('organization')}
            />
            <FieldError message={errors.organization?.message} />
          </div>
        </div>
      </div>
    </div>
  )
}
