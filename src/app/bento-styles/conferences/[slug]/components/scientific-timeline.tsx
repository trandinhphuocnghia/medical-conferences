'use client'

import React from 'react'

import { Bell, Calendar, CheckCircle2, Clock, Flag } from 'lucide-react'

interface TimelineProps {
  abstractSubmissionDeadline: string
  notificationOfAcceptanceDate: string
  earlyRegistrationDeadline: string
  startDate: string
  endDate?: string
}

interface MilestoneData {
  date: string
  label: string
  type: 'deadline' | 'event'
  icon: React.ReactNode
  description: string
}

export function ScientificTimeline({
  abstractSubmissionDeadline,
  notificationOfAcceptanceDate,
  earlyRegistrationDeadline,
  startDate,
  endDate,
}: TimelineProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }
  }

  const milestones: MilestoneData[] = [
    {
      date: abstractSubmissionDeadline,
      label: 'Abstract Submission',
      type: 'deadline',
      icon: <Clock className="h-5 w-5" />,
      description: 'Final deadline for research abstract submissions',
    },
    {
      date: notificationOfAcceptanceDate,
      label: 'Acceptance Notification',
      type: 'deadline',
      icon: <Bell className="h-5 w-5" />,
      description: 'Authors notified of abstract acceptance status',
    },
    {
      date: earlyRegistrationDeadline,
      label: 'Early Registration',
      type: 'deadline',
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: 'Last day for discounted registration rates',
    },
    {
      date: startDate,
      label: 'Conference Begins',
      type: 'event',
      icon: <Flag className="h-5 w-5" />,
      description: endDate
        ? `Conference runs through ${formatDate(endDate).full}`
        : 'Opening ceremony and keynote sessions',
    },
  ]

  const isPast = (dateStr: string) => new Date(dateStr) < new Date()

  return (
    <section className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <span className="font-mono text-[10px] sm:text-xs tracking-widest text-cyan-600 uppercase">
          Important Dates
        </span>
        <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
          Scientific Milestone Tracker
        </h2>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Key deadlines and event dates for your planning
        </p>
      </div>

      {/* Desktop Horizontal Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-[60px] left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2E8F0] via-[#06B6D4] to-[#E2E8F0]" />

          <div className="grid grid-cols-4 gap-4">
            {milestones.map((milestone, index) => {
              const dateFormatted = formatDate(milestone.date)
              const past = isPast(milestone.date)

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  {/* Icon Node */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-4 border-2 transition-all ${
                      milestone.type === 'event'
                        ? 'bg-[#0F172A] border-[#0F172A] text-white'
                        : past
                          ? 'bg-slate-100 border-slate-300 text-slate-400'
                          : 'bg-white border-[#06B6D4] text-[#06B6D4]'
                    }`}
                  >
                    {milestone.icon}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full p-4 rounded-xl border backdrop-blur-sm transition-all hover:shadow-lg ${
                      milestone.type === 'event'
                        ? 'bg-[#0F172A] border-[#0F172A] text-white'
                        : 'bg-white/80 border-[#E2E8F0]'
                    }`}
                  >
                    {/* Type Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium mb-3 ${
                        milestone.type === 'event'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {milestone.type === 'deadline' ? (
                        <Clock className="h-2.5 w-2.5" />
                      ) : (
                        <Calendar className="h-2.5 w-2.5" />
                      )}
                      {milestone.type}
                    </span>

                    {/* Date Display */}
                    <div className="font-mono text-center mb-3">
                      <div
                        className={`text-3xl font-bold ${
                          milestone.type === 'event'
                            ? 'text-white'
                            : 'text-[#0F172A]'
                        }`}
                      >
                        {dateFormatted.day}
                      </div>
                      <div
                        className={`text-sm uppercase tracking-wider ${
                          milestone.type === 'event'
                            ? 'text-cyan-300'
                            : 'text-[#06B6D4]'
                        }`}
                      >
                        {dateFormatted.month} {dateFormatted.year}
                      </div>
                    </div>

                    {/* Label & Description */}
                    <h3
                      className={`font-semibold text-sm mb-1 ${
                        milestone.type === 'event'
                          ? 'text-white'
                          : 'text-[#0F172A]'
                      }`}
                    >
                      {milestone.label}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        milestone.type === 'event'
                          ? 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {milestone.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="lg:hidden space-y-3 sm:space-y-4">
        {milestones.map((milestone, index) => {
          const dateFormatted = formatDate(milestone.date)
          const past = isPast(milestone.date)

          return (
            <div
              key={index}
              className={`flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border backdrop-blur-sm ${
                milestone.type === 'event'
                  ? 'bg-[#0F172A] border-[#0F172A]'
                  : 'bg-white/80 border-[#E2E8F0]'
              }`}
            >
              {/* Icon */}
              <div
                className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 ${
                  milestone.type === 'event'
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                    : past
                      ? 'bg-slate-100 border-slate-300 text-slate-400'
                      : 'bg-cyan-50 border-[#06B6D4] text-[#06B6D4]'
                }`}
              >
                <span className="[&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                  {milestone.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider font-medium ${
                      milestone.type === 'event'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {milestone.type}
                  </span>
                </div>
                <h3
                  className={`font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 ${
                    milestone.type === 'event' ? 'text-white' : 'text-[#0F172A]'
                  }`}
                >
                  {milestone.label}
                </h3>
                <p
                  className={`text-[11px] sm:text-xs mb-1.5 sm:mb-2 leading-relaxed ${
                    milestone.type === 'event'
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {milestone.description}
                </p>
                <div
                  className={`font-mono text-xs sm:text-sm font-medium ${
                    milestone.type === 'event'
                      ? 'text-cyan-300'
                      : 'text-[#06B6D4]'
                  }`}
                >
                  {dateFormatted.month} {dateFormatted.day},{' '}
                  {dateFormatted.year}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
