'use client'

import type { Course, User } from '@/payload-types'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/utilities/ui'

// ── Types ──────────────────────────────────────────────────────────────────────
type CurriculumModule = NonNullable<Course['curriculum']>[number]

type CurriculumAccordionProps = {
  curriculum?: Course['curriculum'] | null
  titleLabel?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function isUser(instructor: number | User): instructor is User {
  return typeof instructor === 'object' && instructor !== null
}

// ── Component ─────────────────────────────────────────────────────────────────
export function CurriculumAccordion({
  curriculum,
  titleLabel,
}: CurriculumAccordionProps) {
  const t = useTranslations('CourseDetail')
  const sectionTitle = titleLabel || t('curriculumTitle')

  if (!curriculum || curriculum.length === 0) return null

  return (
    <section
      aria-labelledby="curriculum-section-title"
      className="py-12 md:py-16 bg-background"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">

          {/* ── Section Header ─────────────────────────────────────────── */}
          <div>
            <h2 id="curriculum-section-title" className="text-h2 text-clinical">
              {sectionTitle}
            </h2>
            <div className="mt-2 h-1 w-12 bg-accent rounded-full" />
          </div>

          {/* ── Accordion List ─────────────────────────────────────────── */}
          <Accordion type="multiple" className="flex flex-col gap-2">
            {curriculum.map((module, index) => {
              const hours = [
                { label: t('theoryHours'), value: module.theory_hours ?? 0, icon: '📖' },
                { label: t('practiceLabHours'), value: module.practice_lab_hours ?? 0, icon: '🔬' },
                { label: t('practiceClinicalHours'), value: module.practice_clinical_hours ?? 0, icon: '🏥' },
              ].filter((h) => h.value > 0)
              const instructors = (module.instructors ?? []).filter(isUser)
              const key = module.id ?? `module-${index}`

              return (
                <AccordionItem
                  key={key}
                  value={key}
                  className={cn(
                    'rounded-lg border border-border bg-card overflow-hidden',
                    // Remove the default bottom border added by AccordionItem
                    'border-b-0',
                  )}
                >
                  {/* ── Trigger ──────────────────────────────────────── */}
                  <AccordionTrigger
                    className={cn(
                      // Override shadcn's "hover:underline" with an organic background shift
                      'px-5 py-4 text-left text-base font-semibold text-foreground',
                      'hover:no-underline hover:bg-muted/50 rounded-lg',
                      // Chevron transition inherited from the base component
                      'data-[state=open]:rounded-b-none data-[state=open]:bg-muted/30',
                      'transition-colors duration-200',
                    )}
                  >
                    {/* Module index badge + title */}
                    <span className="flex items-center gap-3">
                      <span
                        className="flex-shrink-0 size-7 flex items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-bold"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      {module.module_title}
                    </span>
                  </AccordionTrigger>

                  {/* ── Revealed Content ─────────────────────────────── */}
                  <AccordionContent
                    className={cn(
                      'px-5 bg-muted/20',
                    )}
                  >
                    <div className="flex flex-col gap-5 py-4">

                      {/* Hours Breakdown */}
                      {hours.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {t('hoursLabel')}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {hours.map((h) => (
                              <div
                                key={h.label}
                                className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border/60 px-3 py-1.5"
                              >
                                <span aria-hidden="true">{h.icon}</span>
                                <span className="text-sm text-foreground/80">
                                  <span className="font-semibold text-foreground">{h.value}h</span>{' '}
                                  {h.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Instructors */}
                      {instructors.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {t('instructorsLabel')}
                          </p>
                          <ul className="flex flex-col gap-1.5" role="list">
                            {instructors.map((user) => (
                              <li
                                key={user.id}
                                className="flex items-center gap-2 text-sm text-foreground/80"
                              >
                                {/* Avatar placeholder */}
                                <span
                                  className="size-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-semibold flex-shrink-0"
                                  aria-hidden="true"
                                >
                                  {user.firstName.charAt(0).toUpperCase()}
                                </span>
                                <span>{user.fullname ?? `${user.firstName} ${user.lastName}`}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

        </div>
      </div>
    </section>
  )
}
