import * as React from 'react'
import { cn } from '@/utilities/ui'

export interface CourseRegisterButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  ctaLabel?: string
}

export function CourseRegisterButton({
  href,
  ctaLabel = 'Register Now',
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
      {/* Registration icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      {ctaLabel}
    </a>
  )
}
