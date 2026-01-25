'use client'

import { Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'

export interface Conference {
  id: string
  title: string
  date: string
  dateDisplay: string
  location: string
  specialty: string
  seatsAvailable: number
  totalSeats: number
  cmeCredits: number
  isOnline: boolean
}

interface ConferenceCardProps {
  conference: Conference
}

const specialtyColors: Record<string, { bg: string; text: string }> = {
  Oncology: { bg: 'bg-rose-50', text: 'text-rose-700' },
  Cardiology: { bg: 'bg-red-50', text: 'text-red-700' },
  Neurology: { bg: 'bg-violet-50', text: 'text-violet-700' },
  Immunology: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Pediatrics: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Surgery: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Radiology: { bg: 'bg-slate-100', text: 'text-slate-700' },
  Dermatology: { bg: 'bg-pink-50', text: 'text-pink-700' },
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
  const specialtyStyle = specialtyColors[conference.specialty] || {
    bg: 'bg-[#06B6D4]/10',
    text: 'text-[#06B6D4]',
  }

  const seatPercentage = (conference.seatsAvailable / conference.totalSeats) * 100
  const isLowSeats = seatPercentage < 20

  return (
    <Link href={`/posts/${conference.id}`} className="group block">
      <div
        className={`
          relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white/80 backdrop-blur-sm
          p-6 transition-all duration-300
          hover:shadow-xl hover:shadow-[#06B6D4]/5 hover:-translate-y-1 hover:border-[#06B6D4]/30
        `}
      >
        {/* Molecular Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <pattern
              id={`molecular-${conference.id}`}
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="2" fill="#0F172A" />
              <circle cx="40" cy="40" r="2" fill="#0F172A" />
              <circle cx="25" cy="25" r="3" fill="#06B6D4" />
              <line x1="10" y1="10" x2="25" y2="25" stroke="#0F172A" strokeWidth="0.5" />
              <line x1="25" y1="25" x2="40" y2="40" stroke="#0F172A" strokeWidth="0.5" />
              <circle cx="40" cy="10" r="1.5" fill="#0F172A" />
              <line x1="25" y1="25" x2="40" y2="10" stroke="#06B6D4" strokeWidth="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#molecular-${conference.id})`} />
          </svg>
        </div>

        {/* Content */}
        <div className="relative flex flex-col gap-4">
          {/* Header with Specialty Tag */}
          <div className="flex items-start justify-between gap-3">
            <span
              className={`
                inline-flex px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide
                ${specialtyStyle.bg} ${specialtyStyle.text}
              `}
            >
              {conference.specialty}
            </span>

            {/* Live Seat Count Badge */}
            <div
              className={`
                flex items-center gap-1.5 rounded-full px-3 py-1.5
                ${isLowSeats ? 'bg-rose-50 text-rose-600' : 'bg-[#06B6D4]/10 text-[#06B6D4]'}
              `}
            >
              <Users className="h-3.5 w-3.5" />
              <span className="font-mono text-xs font-medium">
                {conference.seatsAvailable} seats
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#0F172A] leading-snug group-hover:text-[#06B6D4] transition-colors line-clamp-2 text-balance">
            {conference.title}
          </h3>

          {/* Meta Info */}
          <div className="flex flex-col gap-2 mt-auto">
            {/* Date */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <Calendar className="h-4 w-4 text-[#0F172A]/60" />
              </div>
              <span className="font-mono text-sm text-[#0F172A]/70">{conference.dateDisplay}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <MapPin className="h-4 w-4 text-[#0F172A]/60" />
              </div>
              <span className="text-sm text-[#0F172A]/70">
                {conference.isOnline ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                ) : (
                  conference.location
                )}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#0F172A]/50">CME Credits:</span>
              <span className="font-mono text-sm font-semibold text-[#06B6D4]">
                {conference.cmeCredits}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#0F172A]/40 uppercase tracking-wider">
              ID: {conference.id}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
