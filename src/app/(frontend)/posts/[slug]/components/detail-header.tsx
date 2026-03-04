'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Post } from '@/payload-types'
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
    venueName,
    venueCity,
    id,
  } = conference
  const router = useRouter()

  const location = `${venueName}, ${venueCity}`
  const startDate = new Date(conferenceStartDate)
  const endDate = new Date(conferenceEndDate)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <section id="overview" className="bg-background py-12 sm:py-16 scroll-mt-[132px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Title */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy tracking-tight mb-4">
            {conference?.title}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">{conference?.theme}</p>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Dates</p>
              <p className="font-semibold text-foreground">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold text-foreground">{location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-accent" />
            {/* 
            Attendees Count
            <div>
              <p className="text-sm text-muted-foreground">Attendees</p>
              <p className="font-semibold text-foreground">
                {(attendeeCount || 0).toLocaleString()}+
              </p>
            </div> */}
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
