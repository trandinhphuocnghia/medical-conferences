'use client'

import { Button } from '@/components/ui/button'
import { Post } from '@/payload-types'
import { Building2, ExternalLink, Mail, Map, MapPin, Phone } from 'lucide-react'

interface LogisticsBentoProps {
  conference: Post
  venueAddress?: string
  floorPlanUrl?: string
}

export function LogisticsBento({ conference, venueAddress, floorPlanUrl }: LogisticsBentoProps) {
  const { venueName, venueCity, contactEmails, contactPhones } = conference

  // Extract email strings from the contactEmails array
  const emailList = contactEmails.map((item) => item.email)

  // Extract phone strings from the contactPhones array
  const phoneList = contactPhones.map((item) => item.phone)

  return (
    <section className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <span className="font-mono text-[10px] sm:text-xs tracking-widest text-cyan-600 uppercase">
          Logistics
        </span>
        <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
          Venue & Contact Information
        </h2>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Everything you need to plan your attendance
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* Venue Card */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="venue-grid"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="1" fill="#0F172A" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#venue-grid)" />
            </svg>
          </div>

          <div className="relative p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-700 flex items-center justify-center shadow-lg">
                <Building2 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-[10px] sm:text-xs font-medium border border-cyan-500/20">
                Conference Venue
              </span>
            </div>

            {/* Venue Info */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-[#0F172A] mb-1">
                  {venueName}
                </h3>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <MapPin className="h-4 w-4 text-[#06B6D4] shrink-0" />
                  <span>{venueCity}</span>
                </div>
              </div>

              {venueAddress && (
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-6">
                  {venueAddress}
                </p>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#E2E8F0]">
                <div className="text-center p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#0F172A]">12</div>
                  <div className="text-[10px] sm:text-xs text-slate-500">Session Halls</div>
                </div>
                <div className="text-center p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50">
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#0F172A]">
                    5000+
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500">Capacity</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {floorPlanUrl && (
              <div className="mt-4 sm:mt-6">
                <Button
                  variant="outline"
                  className="w-full border-[#E2E8F0] hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all gap-2 bg-transparent text-sm"
                  onClick={() => window.open(floorPlanUrl, '_blank')}
                >
                  <Map className="h-4 w-4" />
                  View Floor Plan
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Card */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="contact-lines"
                  x="0"
                  y="0"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M 0 10 L 10 0" stroke="#0F172A" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#contact-lines)" />
            </svg>
          </div>

          <div className="relative p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#06B6D4] to-cyan-600 flex items-center justify-center shadow-lg">
                <Mail className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#0F172A]/5 text-[#0F172A] text-[10px] sm:text-xs font-medium border border-[#0F172A]/10">
                Secretariat
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-[#0F172A] mb-1">
                  Conference Secretariat
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Get in touch for inquiries and support
                </p>
              </div>

              {/* Email List */}
              {emailList.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">
                    <Mail className="h-3 w-3" />
                    Email Contacts
                  </div>
                  {emailList.map((email, index) => (
                    <a
                      key={index}
                      href={`mailto:${email}`}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-cyan-50 transition-colors group/email"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0">
                        <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#06B6D4]" />
                      </div>
                      <span className="text-xs sm:text-sm text-[#0F172A] font-medium group-hover/email:text-[#06B6D4] transition-colors truncate">
                        {email}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* Phone List */}
              {phoneList.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">
                    <Phone className="h-3 w-3" />
                    Phone Contacts
                  </div>
                  {phoneList.map((phone, index) => (
                    <a
                      key={index}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-cyan-50 transition-colors group/phone"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0">
                        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#06B6D4]" />
                      </div>
                      <span className="font-mono text-xs sm:text-sm text-[#0F172A] font-medium group-hover/phone:text-[#06B6D4] transition-colors">
                        {phone}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
