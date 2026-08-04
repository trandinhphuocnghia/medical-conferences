import { useTranslations } from 'next-intl'

interface Step {
  label: string
}

interface ProgressTrackerProps {
  currentStep: number
  totalSteps: number
  steps: Step[]
}

/**
 * ProgressTracker
 *
 * Renders a horizontal step indicator using project design tokens only —
 * no raw Tailwind color classes. Completed steps are filled with the navy
 * accent; the active step is outlined in cyan; future steps remain muted.
 */
export function ProgressTracker({ currentStep, totalSteps, steps }: ProgressTrackerProps) {
  const t = useTranslations('CourseApplication')

  return (
    <nav aria-label={t('steps.progressLabel')} className="mb-8">
      <ol className="flex items-center gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep

          return (
            <li key={stepNumber} className="flex flex-1 items-center">
              {/* Circle + label */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  aria-current={isActive ? 'step' : undefined}
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200',
                    isCompleted
                      ? 'bg-navy text-primary-foreground'
                      : isActive
                        ? 'border-2 border-cyan bg-card text-navy'
                        : 'border-2 border-border bg-card text-muted-foreground',
                  ].join(' ')}
                >
                  {isCompleted ? (
                    /* Checkmark for completed steps */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>

                <span
                  className={[
                    'text-xs font-medium whitespace-nowrap',
                    isActive ? 'text-navy' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line (not rendered after the last step) */}
              {stepNumber < totalSteps && (
                <div
                  className={[
                    'h-px flex-1 mx-2 mb-4 transition-colors duration-200',
                    isCompleted ? 'bg-navy' : 'bg-border',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
