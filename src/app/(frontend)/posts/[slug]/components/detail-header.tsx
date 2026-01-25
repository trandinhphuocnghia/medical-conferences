'use client'

import { Button } from '@/components/ui/button'
import { isCategory, isTopic, isUserGroup } from '@/helpers'
import type { Post } from '@/payload-types'
import { ArrowLeft, Award, Bookmark, Calendar, MapPin, Share2, Users } from 'lucide-react'
import Link from 'next/link'

interface DetailHeaderProps {
  conference: Post
  /** Fallback attendee count if not available from conference */
  attendees?: number
  /** CME credits offered */
  cmeCredits?: number
}

export function DetailHeader({ conference, attendees = 1000, cmeCredits = 20 }: DetailHeaderProps) {
  const { title, theme, startDate, endDate, venueName, venueCity, topics, host } = conference

  // Get primary specialty from first topic's category
  const getSpecialty = (): string => {
    if (!topics || topics.length === 0) return 'Medical Conference'

    const firstTopic = topics[0]
    if (isTopic(firstTopic) && isCategory(firstTopic.category)) {
      return firstTopic.category.name
    }
    return 'Medical Conference'
  }

  // Get host name
  const getHostName = (): string => {
    if (isUserGroup(host)) {
      return host.name
    }
    return ''
  }

  const formatDateRange = (start: string, end: string) => {
    const startDateObj = new Date(start)
    const endDateObj = new Date(end)

    const startMonth = startDateObj.toLocaleDateString('en-US', {
      month: 'short',
    })
    const endMonth = endDateObj.toLocaleDateString('en-US', { month: 'short' })
    const year = startDateObj.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDateObj.getDate()}-${endDateObj.getDate()}, ${year}`
    }
    return `${startMonth} ${startDateObj.getDate()} - ${endMonth} ${endDateObj.getDate()}, ${year}`
  }

  const location = `${venueName}, ${venueCity}`
  const specialty = getSpecialty()
  const hostName = getHostName()

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0F172A]">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <pattern
                id="header-molecules"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="50" cy="50" r="2" fill="#06B6D4" />
                <circle cx="20" cy="20" r="1.5" fill="#06B6D4" />
                <circle cx="80" cy="30" r="1" fill="#06B6D4" />
                <circle cx="30" cy="80" r="1.5" fill="#06B6D4" />
                <circle cx="70" cy="70" r="1" fill="#06B6D4" />
                <line x1="50" y1="50" x2="20" y2="20" stroke="#06B6D4" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="80" y2="30" stroke="#06B6D4" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="30" y2="80" stroke="#06B6D4" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="70" y2="70" stroke="#06B6D4" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#header-molecules)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#F8FAFC] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/conferences"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium hidden sm:inline">Back to Conferences</span>
            <span className="text-sm font-medium sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="max-w-4xl">
          {/* Specialty Tag */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-sm font-medium mb-3 sm:mb-4 border border-[#06B6D4]/30">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
            {specialty}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 sm:mb-3 text-balance leading-tight">
            {title || 'Untitled Conference'}
          </h1>

          {/* Theme/Subtitle */}
          {theme && (
            <p className="text-base sm:text-lg text-slate-300 mb-4 sm:mb-6 max-w-2xl leading-relaxed">
              {theme}
            </p>
          )}

          {/* Host */}
          {hostName && (
            <p className="text-sm text-slate-400 mb-6 sm:mb-8">
              Hosted by <span className="text-white font-medium">{hostName}</span>
            </p>
          )}

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                <Calendar className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                DATE
              </div>
              <div className="font-mono text-white font-semibold text-sm sm:text-base">
                {formatDateRange(startDate, endDate)}
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                <MapPin className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                LOCATION
              </div>
              <div className="text-white font-semibold text-sm sm:text-base">{location}</div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                <Users className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                ATTENDEES
              </div>
              <div className="font-mono text-white font-semibold text-sm sm:text-base">
                {attendees.toLocaleString()}+
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                <Award className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                CME CREDITS
              </div>
              <div className="font-mono text-[#06B6D4] font-semibold text-sm sm:text-base">
                {cmeCredits} Credits
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button
              size="lg"
              className="bg-[#06B6D4] hover:bg-[#0891B2] text-white font-semibold px-6 sm:px-8 w-full sm:w-auto text-base"
            >
              Register Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 font-semibold px-6 sm:px-8 bg-transparent w-full sm:w-auto text-base"
            >
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
