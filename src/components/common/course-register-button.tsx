import * as React from 'react'
import { ClipboardList } from 'lucide-react'
import { cn } from '@/utilities/ui'

export interface CourseRegisterButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  ctaLabel?: string
}

export function CourseRegisterButton({
  href,
  ctaLabel = 'Apply for Enrollment',
  className,
  ...props
}: CourseRegisterButtonProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={cn(
        "w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 ease-out hover:-translate-y-1 hover:opacity-90 active:translate-y-0 active:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {/* Application form icon */}
      <ClipboardList className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
      {ctaLabel}
    </a>
  )
}
