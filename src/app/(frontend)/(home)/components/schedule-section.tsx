'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface Session {
  time: string
  title: string
  speaker: string
  location: string
  track: string
}

const scheduleData: Record<string, Session[]> = {
  'Day 1': [
    {
      time: '09:00',
      title: 'Opening Ceremony & Welcome Address',
      speaker: 'Conference Committee',
      location: 'Grand Ballroom',
      track: 'Plenary',
    },
    {
      time: '10:30',
      title: 'Advances in Precision Oncology',
      speaker: 'Dr. Sarah Chen',
      location: 'Hall A',
      track: 'Oncology',
    },
    {
      time: '14:00',
      title: 'AI in Diagnostic Imaging',
      speaker: 'Prof. David Kim',
      location: 'Hall B',
      track: 'Technology',
    },
    {
      time: '16:00',
      title: 'Networking Reception',
      speaker: 'All Attendees',
      location: 'Exhibition Hall',
      track: 'Social',
    },
  ],
  'Day 2': [
    {
      time: '08:30',
      title: 'Cardiovascular Innovations Workshop',
      speaker: 'Prof. James Mueller',
      location: 'Workshop Room 1',
      track: 'Workshop',
    },
    {
      time: '11:00',
      title: 'Gene Therapy: Current State & Future',
      speaker: 'Dr. Aisha Patel',
      location: 'Hall A',
      track: 'Research',
    },
    {
      time: '14:30',
      title: 'Telemedicine Best Practices',
      speaker: 'Dr. Lisa Wong',
      location: 'Hall C',
      track: 'Practice',
    },
    {
      time: '17:00',
      title: 'Poster Session & Discussion',
      speaker: 'Research Presenters',
      location: 'Exhibition Hall',
      track: 'Research',
    },
  ],
  'Day 3': [
    {
      time: '09:00',
      title: 'Immunotherapy Breakthroughs',
      speaker: 'Dr. Michael Okonkwo',
      location: 'Grand Ballroom',
      track: 'Plenary',
    },
    {
      time: '11:30',
      title: 'Surgical Simulation Lab',
      speaker: 'Dr. Robert Martinez',
      location: 'Simulation Center',
      track: 'Workshop',
    },
    {
      time: '15:00',
      title: 'Panel: Future of Healthcare',
      speaker: 'Expert Panel',
      location: 'Hall A',
      track: 'Discussion',
    },
    {
      time: '18:00',
      title: 'Gala Dinner & Awards',
      speaker: 'All Attendees',
      location: 'Grand Ballroom',
      track: 'Social',
    },
  ],
  'Day 4': [
    {
      time: '09:00',
      title: 'Closing Keynote: Medicine 2030',
      speaker: 'Dr. Sarah Chen',
      location: 'Grand Ballroom',
      track: 'Plenary',
    },
    {
      time: '11:00',
      title: 'Summary & Key Takeaways',
      speaker: 'Conference Committee',
      location: 'Grand Ballroom',
      track: 'Plenary',
    },
    {
      time: '12:30',
      title: 'Farewell Lunch',
      speaker: 'All Attendees',
      location: 'Garden Terrace',
      track: 'Social',
    },
  ],
}

const trackColors: Record<string, string> = {
  Plenary: 'bg-primary text-primary-foreground',
  Oncology: 'bg-accent/20 text-accent',
  Technology: 'bg-cyan-100 text-cyan-700',
  Workshop: 'bg-amber-100 text-amber-700',
  Research: 'bg-emerald-100 text-emerald-700',
  Practice: 'bg-rose-100 text-rose-700',
  Discussion: 'bg-indigo-100 text-indigo-700',
  Social: 'bg-secondary text-secondary-foreground',
}

export function ScheduleSection() {
  const [activeDay, setActiveDay] = useState('Day 1')
  const days = Object.keys(scheduleData)

  return (
    <section id="schedule" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Conference Schedule
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Four packed days of keynotes, workshops, research presentations, and networking
            opportunities.
          </p>
        </div>

        {/* Day Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {days.map((day, index) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeDay === day
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {day}
              <span className="hidden sm:inline ml-1 opacity-70">- Sept {15 + index}</span>
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {scheduleData[activeDay].map((session, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-5 sm:p-6 hover:border-accent/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Time */}
                <div className="flex items-center gap-2 text-muted-foreground sm:w-24">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-sm">{session.time}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${trackColors[session.track]}`}
                    >
                      {session.track}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">{session.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{session.speaker}</p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{session.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md px-8 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            All Conferences
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
