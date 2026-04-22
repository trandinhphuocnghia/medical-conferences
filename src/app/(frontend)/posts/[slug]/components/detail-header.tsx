'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Post } from '@/payload-types'
import { formatDate } from '@/utilities/dateUtils'
import { Calendar, MapPin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DetailHeaderProps {
  conference: Post
  /** Fallback attendee count if not available from conference */
  attendees?: number
  /** CME credits offered */
  cmeCredits?: number
}

export function DetailHeader({ conference }: DetailHeaderProps) {
  const {
    startDate: conferenceStartDate,
    endDate: conferenceEndDate,
    venueCity,
    venues,
    id,
  } = conference
  const router = useRouter()

  const startDate = new Date(conferenceStartDate)
  const endDate = new Date(conferenceEndDate)

  return (
    <section id="overview" className="bg-background py-8 sm:py-12 scroll-mt-[132px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy tracking-tight mb-4">
            {conference?.title}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">{conference?.theme}</p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-24 mb-10">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-accent mt-1 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Dates</p>
              <div className="mt-1">
                <p className="font-semibold text-foreground">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-accent mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <div className="space-y-2 mt-1">
                {venues && venues.length > 0 ? (
                  venues.map((v, i) => (
                    <div key={i} className="text-sm sm:text-base">
                      <p className="font-semibold text-foreground leading-snug">
                        {v.name}
                        {v.city && <span className="font-normal opacity-80">, {v.city}</span>}
                      </p>
                      {v.address && (
                        <p className="text-xs text-muted-foreground mt-0.5">{v.address}</p>
                      )}
                      {v.note && (
                        <p className="text-xs font-medium text-accent mt-0.5 italic">{v.note}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="font-semibold text-foreground">
                    {venueCity && <span className="font-normal opacity-80">, {venueCity}</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Call for Abstract Card */}
        <div className="bg-primary text-primary-foreground rounded-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Call for Abstracts</h2>
              <p className="text-sm sm:text-base opacity-90">
                Submit your research and present at the conference
              </p>
              <Badge className="mt-3 bg-accent text-accent-foreground">
                Deadline:
                {formatDate(new Date(conference?.abstractSubmissionDeadline || new Date()))}
              </Badge>
            </div>
            <Button
              onClick={() => router.push(`/submit-abstract?conference=${id}`)}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
            >
              Submit Abstract
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
