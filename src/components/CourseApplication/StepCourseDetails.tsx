'use client'

import { useTranslations } from 'next-intl'
import type { UseFormReturn } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ApplicationFormValues } from './schema'

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */
interface StepCourseDetailsProps {
  form: UseFormReturn<ApplicationFormValues>
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Helpers — mirrors the pattern in StepPersonalInfo.tsx
 * ──────────────────────────────────────────────────────────────────────────── */
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-destructive text-sm mt-1">{message}</p>
}

/* ─────────────────────────────────────────────────────────────────────────────
 * StepCourseDetails
 * ──────────────────────────────────────────────────────────────────────────── */
export function StepCourseDetails({ form }: StepCourseDetailsProps) {
  const t = useTranslations('CourseApplication')

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const enrollmentType = watch('enrollment_type')
  const isShortCourse = enrollmentType === 'short_course'
  const isPostgraduate = enrollmentType === 'postgraduate'

  // RHF errors for discriminated union branches — errors may be nested
  // under the union path; we cast liberally and fall back to undefined.
  const branchErrors = errors as Record<string, { message?: string } | undefined>

  return (
    <div className="space-y-6">

      {/* ── Enrollment Type — Radio Cards ──────────────────────────────────── */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground mb-3">
          {t('fields.enrollmentType')}
          <span className="text-destructive ml-0.5">*</span>
        </legend>

        <RadioGroup
          value={enrollmentType}
          onValueChange={(value) => {
            setValue(
              'enrollment_type',
              value as 'short_course' | 'postgraduate',
              { shouldValidate: true },
            )
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* Short Course card */}
          <label
            htmlFor="enrollment_type_short_course"
            className={[
              'flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors duration-150',
              isShortCourse
                ? 'border-cyan bg-cyan/5'
                : 'border-border bg-background hover:border-cyan/50',
            ].join(' ')}
          >
            <RadioGroupItem
              id="enrollment_type_short_course"
              value="short_course"
              className="mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-foreground leading-snug">
                {t('fields.enrollmentTypeShortCourse')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {t('fields.enrollmentTypeShortCourseDesc')}
              </p>
            </div>
          </label>

          {/* Postgraduate card */}
          <label
            htmlFor="enrollment_type_postgraduate"
            className={[
              'flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors duration-150',
              isPostgraduate
                ? 'border-cyan bg-cyan/5'
                : 'border-border bg-background hover:border-cyan/50',
            ].join(' ')}
          >
            <RadioGroupItem
              id="enrollment_type_postgraduate"
              value="postgraduate"
              className="mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-foreground leading-snug">
                {t('fields.enrollmentTypePostgraduate')}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {t('fields.enrollmentTypePostgraduateDesc')}
              </p>
            </div>
          </label>
        </RadioGroup>
      </fieldset>

      {/* ── Short Course fields (progressive disclosure) ───────────────────── */}
      <div
        className={[
          'overflow-hidden transition-all duration-300',
          isShortCourse ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
        aria-hidden={!isShortCourse}
      >
        <div className="space-y-5 pt-1">

          {/* Preferred Duration */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="preferred_duration">
              {t('fields.preferredDuration')}
            </FieldLabel>
            <Input
              id="preferred_duration"
              type="text"
              placeholder={t('fields.preferredDurationPlaceholder')}
              {...register('preferred_duration')}
            />
            <FieldError message={branchErrors.preferred_duration?.message} />
          </div>

          {/* Preferred Content */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="preferred_content">
              {t('fields.preferredContent')}
            </FieldLabel>
            <Textarea
              id="preferred_content"
              rows={4}
              placeholder={t('fields.preferredContentPlaceholder')}
              className="resize-none"
              {...register('preferred_content')}
            />
            <FieldError message={branchErrors.preferred_content?.message} />
          </div>

          {/* Preferred Start + End Date — side by side */}
          <div className="flex flex-col md:flex-row md:gap-4 gap-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <FieldLabel htmlFor="preferred_start_date">
                {t('fields.preferredStartDate')}
              </FieldLabel>
              <Input
                id="preferred_start_date"
                type="date"
                {...register('preferred_start_date')}
              />
              <FieldError message={branchErrors.preferred_start_date?.message} />
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <FieldLabel htmlFor="preferred_end_date">
                {t('fields.preferredEndDate')}
              </FieldLabel>
              <Input
                id="preferred_end_date"
                type="date"
                {...register('preferred_end_date')}
              />
              <FieldError message={branchErrors.preferred_end_date?.message} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Postgraduate fields (progressive disclosure) ────────────────────── */}
      <div
        className={[
          'overflow-hidden transition-all duration-300',
          isPostgraduate ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
        aria-hidden={!isPostgraduate}
      >
        <div className="space-y-5 pt-1">

          {/* Academic Level — Select */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="academic_level" required>
              {t('fields.academicLevel')}
            </FieldLabel>
            <Select
              value={isPostgraduate ? (watch('academic_level' as keyof ApplicationFormValues) as string | undefined) ?? '' : ''}
              onValueChange={(value) => {
                setValue(
                  'academic_level' as keyof ApplicationFormValues,
                  value as 'master' | 'resident' | 'phd',
                  { shouldValidate: true },
                )
              }}
            >
              <SelectTrigger id="academic_level" aria-required="true">
                <SelectValue placeholder={t('fields.academicLevelPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="master">
                  {t('fields.academicLevelMaster')}
                </SelectItem>
                <SelectItem value="resident">
                  {t('fields.academicLevelResident')}
                </SelectItem>
                <SelectItem value="phd">
                  {t('fields.academicLevelPhd')}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={branchErrors.academic_level?.message} />
          </div>

          {/* Entrance Exam Passed — Checkbox */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="entrance_exam_passed"
              checked={isPostgraduate
                ? !!(watch('entrance_exam_passed' as keyof ApplicationFormValues))
                : false}
              onCheckedChange={(checked) => {
                setValue(
                  'entrance_exam_passed' as keyof ApplicationFormValues,
                  checked === true,
                  { shouldValidate: true },
                )
              }}
            />
            <Label
              htmlFor="entrance_exam_passed"
              className="text-sm font-medium text-foreground cursor-pointer leading-snug"
            >
              {t('fields.entranceExamPassed')}
            </Label>
          </div>

          {/* Research Start + End Month — side by side, native month picker */}
          <div className="flex flex-col md:flex-row md:gap-4 gap-5">
            <div className="flex-1 flex flex-col gap-1.5">
              <FieldLabel htmlFor="research_start_month">
                {t('fields.researchStartMonth')}
              </FieldLabel>
              <Input
                id="research_start_month"
                type="month"
                {...register('research_start_month')}
              />
              <FieldError message={branchErrors.research_start_month?.message} />
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <FieldLabel htmlFor="research_end_month">
                {t('fields.researchEndMonth')}
              </FieldLabel>
              <Input
                id="research_end_month"
                type="month"
                {...register('research_end_month')}
              />
              <FieldError message={branchErrors.research_end_month?.message} />
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
