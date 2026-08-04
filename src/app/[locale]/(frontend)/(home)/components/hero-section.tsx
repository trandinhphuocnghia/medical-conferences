import { Button } from '@/components/ui/button'
import { Post } from '@/payload-types'
import { formatDateRange } from '@/utilities/dateUtils'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

type HeroSectionProps = {
  conference: Post | null
}

function isAbstractOpen(deadline?: string | null): boolean {
  if (!deadline) return false
  return new Date(deadline) > new Date()
}

export function HeroSection({ conference }: HeroSectionProps) {
  const dateRange = formatDateRange(conference?.startDate, conference?.endDate)

  const abstractOpen = isAbstractOpen(conference?.abstractSubmissionDeadline as string | null)

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,200,200,0.3),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(0,200,200,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium">
            {abstractOpen ? 'Abstract Submission Open' : 'Registration Now Open'}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight text-balance max-w-5xl mx-auto leading-tight">
          {conference?.title ?? 'Advancing Medicine Through Collaboration'}
        </h1>

        {/* Subtitle / Theme */}
        <p className="mt-6 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed text-pretty">
          {conference?.theme ??
            'Join healthcare professionals at the premier international medical conference.'}
        </p>

        {/* Event Details */}
        {(dateRange || location) && (
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-primary-foreground/90">
            {dateRange && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{dateRange}</span>
              </div>
            )}

          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          {conference?.slug ? (
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold"
              asChild
            >
              <Link href={`/posts/${conference.slug}`}>
                View Conference
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold"
            >
              Explore Conferences
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-base font-semibold bg-transparent"
            asChild
          >
            <Link href="/posts">View All Conferences</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
