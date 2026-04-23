'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Post } from '@/payload-types'
import { formatDate } from '@/utilities/dateUtils'
import { ArrowRight, Calendar, MapPin, BookOpen } from 'lucide-react'
import Link from 'next/link'

type Program = Post['program']

interface ProgramPreviewCardProps {
  slug: string
  program?: Program
}

export function ProgramPreviewCard({ slug, program }: ProgramPreviewCardProps) {
  if (!program || program.length === 0) return null

  // Flatten all days for preview
  const allDays = program.flatMap((p) =>
    (p.days || []).map((day) =>
      day
        ? {
          ...day,
          congressTitle: p.title,
        }
        : null,
    ),
  ).filter(Boolean) as (NonNullable<NonNullable<Program>[number]['days']>[number] & {
    congressTitle?: string
  })[]

  const congressCount = program.length
  const dayCount = allDays.length

  return (
    <section id="program" className="pt-6 sm:pt-10 bg-background scroll-mt-[132px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-navy mb-2 mt-2">Program</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Detailed schedule and venue information for each day
          </p>
        </div>

        {/* Preview Card */}
        <Card className="border border-border overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Left — Summary info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg">Scientific Program</p>
                      <p className="text-slate-400 text-sm">
                        {congressCount} congress{congressCount !== 1 ? 'es' : ''} · {dayCount} day
                        {dayCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Day previews */}
                  <div className="flex flex-wrap gap-2">
                    {allDays.slice(0, 4).map((day, i) => (
                      <div
                        key={day.id || i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                      >
                        <Calendar className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span className="text-xs text-slate-300 font-mono">
                          {formatDate(day.date, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {day.venue && (
                          <>
                            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                            <span className="text-xs text-slate-400 truncate max-w-[120px]">
                              {day.venue}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                    {allDays.length > 4 && (
                      <span className="text-xs text-slate-500 self-center">
                        +{allDays.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Congress names */}
                  <div className="flex flex-wrap gap-2">
                    {program.map((p, i) => (
                      <span
                        key={p.id || i}
                        className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {p.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — CTA */}
                <div className="shrink-0">
                  <Link href={`/posts/${slug}/program`}>
                    <Button
                      size="lg"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto gap-2"
                    >
                      View Full Program
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
