'use client'

import { RichTextParser } from '@/components/RichTextParser'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Post } from '@/payload-types'
import { formatDate } from '@/utilities/dateUtils'
import { Calendar, ChevronUp, MapPin } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type Program = Post['program']
type ProgramDay = NonNullable<NonNullable<Program>[number]['days']>[number] & {
  congressTitle?: string
  dayNumber?: number
  totalDaysInCongress?: number
}
interface ProgramSectionProps {
  program?: Program
}

function DayCard({ day }: { day: ProgramDay }) {
  return (
    <Card className="bg-card border border-border overflow-hidden">
      {/* Header with Date and Venue */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-4 sm:px-6 py-4 sm:py-5 border-b border-border">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="font-mono font-semibold text-navy text-sm">
                {formatDate(day.date, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {day.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{day.venue}</span>
              </div>
            )}
          </div>

          {day.title && <p className="text-base sm:text-lg font-bold text-navy">{day.title}</p>}
        </div>
      </div>

      {/* Content - RichText Display */}
      <CardContent className="px-0 py-0">
        <ScrollArea className="px-4 sm:px-6 py-5 sm:py-6">
          {day.content ? (
            <div className="text-foreground leading-relaxed">
              <RichTextParser content={day.content} />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              No content available for this day
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

/** Floating day-picker button that appears on scroll */
function FloatingDayNav({
  allDays,
  activeTab,
  onSelectDay,
}: {
  allDays: ProgramDay[]
  activeTab: string
  onSelectDay: (value: string) => void
}) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  if (!visible || allDays.length <= 1) return null

  const handleSelect = (value: string) => {
    onSelectDay(value)
    setMenuOpen(false)

    // Scroll to top of the program section
    const programSection = document.getElementById('program')
    if (programSection) {
      programSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 mb-1 min-w-[200px]">
          <div className="px-4 py-2.5 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Jump to Day
            </p>
          </div>
          <div className="py-1">
            {allDays.map((day, index) => {
              const value = day.id || String(index)
              const isActive = value === activeTab
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(value)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-foreground hover:bg-muted/50'
                    }`}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <div className="min-w-0">
                    {day.congressTitle && (
                      <p className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-accent' : 'text-muted-foreground'
                        }`}>
                        {day.congressTitle}
                      </p>
                    )}
                    <p className="text-sm font-medium truncate">
                      {day.totalDaysInCongress && day.totalDaysInCongress > 1
                        ? `Day ${day.dayNumber} — `
                        : ''}
                      {formatDate(day.date, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="h-12 px-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-semibold hidden sm:inline">Program</span>
        <ChevronUp
          className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''
            }`}
        />
      </button>
    </div>
  )
}

export function ProgramSection({ program = [] }: ProgramSectionProps) {
  // Flatten all days across all program items with day numbering
  const allDays = (program || [])
    .flatMap((p) => {
      const congressDays = p.days || []
      return congressDays.map((day, dayIdx) =>
        day
          ? {
            ...day,
            congressTitle: p.title,
            dayNumber: dayIdx + 1,
            totalDaysInCongress: congressDays.length,
          }
          : null,
      )
    })
    .filter(Boolean) as ProgramDay[]

  const [activeTab, setActiveTab] = useState(allDays[0]?.id || '0')

  const handleDaySelect = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  if (!program || program.length === 0 || allDays.length === 0) {
    return null
  }

  return (
    <>
      <section id="program" className="pt-6 sm:pt-10 bg-background scroll-mt-[132px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold text-navy mb-2 mt-2">Program</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Detailed schedule and venue information for each day
            </p>
          </div>

          {/* Tabs for Days */}
          {allDays.length > 1 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full gap-2 bg-transparent grid-cols-1 md:grid-cols-3 border border-border rounded-lg p-1 h-auto mb-6">
                {allDays.map((day, index) => (
                  <TabsTrigger
                    key={day.id || index}
                    value={day.id || String(index)}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-colors px-4 py-2 h-full"
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      {day.congressTitle && (
                        <span className="font-bold uppercase tracking-wider opacity-80">
                          {day.congressTitle}
                        </span>
                      )}
                      <span className="text-sm font-semibold">
                        {day.totalDaysInCongress &&
                          day.totalDaysInCongress > 1 &&
                          `Day ${day.dayNumber}`}
                      </span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="space-y-4">
                {allDays.map((day, index) => (
                  <TabsContent key={day.id || index} value={day.id || String(index)}>
                    <DayCard day={day} />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          ) : (
            <DayCard day={allDays[0]} />
          )}
        </div>
      </section>

      {/* Floating Day Navigator */}
      <FloatingDayNav
        allDays={allDays}
        activeTab={activeTab}
        onSelectDay={handleDaySelect}
      />
    </>
  )
}
