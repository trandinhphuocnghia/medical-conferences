'use client'

import { RichTextParser } from '@/components/RichTextParser'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Post } from '@/payload-types'
import { formatDate } from '@/utilities/dateUtils'
import { Calendar, MapPin } from 'lucide-react'

type Program = Post['program']
type ProgramDay = NonNullable<NonNullable<Program>[number]['days']>[number] & {
    congressTitle?: string
}
interface ProgramSectionProps {
    program?: Program
}

function DayCard({
    day,
}: {
    day: ProgramDay
}) {
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
                <ScrollArea className="h-[500px] sm:h-[600px] px-4 sm:px-6 py-5 sm:py-6">
                    {day.content ? (
                        <div className="text-foreground leading-relaxed">
                            <RichTextParser content={day.content} />
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm italic">No content available for this day</p>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export function ProgramSection({ program = [], }: ProgramSectionProps) {
    if (!program || program.length === 0) {
        return null
    }


    // Flatten all days across all program items
    const allDays = program.flatMap((p) =>
        (p.days || []).map(day => day ? ({ ...day, congressTitle: p.title }) : null)
    ).filter(Boolean) as ProgramDay[]


    if (allDays.length === 0) {
        return null
    }

    return (
        <section id="program" className="py-8 sm:py-12 bg-background">
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
                    <Tabs defaultValue={allDays[0].id || '0'} className="w-full">
                        <TabsList className="grid w-full gap-2 bg-transparent grid-cols-1 md:grid-cols-3 border border-border rounded-lg p-1 h-auto mb-6">
                            {allDays.map((day, index) => (
                                <TabsTrigger
                                    key={day.id || index}
                                    value={day.id || String(index)}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-colors text-xs sm:text-sm"
                                >
                                    <p>
                                        <span className="hidden sm:inline">Day {index + 1}</span>
                                        {day.congressTitle && (
                                            <p className="text-xs font-mono font-medium text-accent uppercase tracking-wider">
                                                {day.congressTitle}
                                            </p>
                                        )}
                                        <span className="sm:hidden">D{index + 1}</span>
                                    </p>
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
    )
}

