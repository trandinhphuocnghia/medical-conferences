'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface Session {
  id: string
  time: string
  title: string
  speaker: string
  location: string
  category: string
}

const sessionsByDay = {
  day1: [
    {
      id: '1',
      time: '09:00 - 10:30',
      title: 'Opening Keynote: Precision Medicine in the Modern Era',
      speaker: 'Dr. Sarah Johnson',
      location: 'Main Hall A',
      category: 'Keynote',
    },
    {
      id: '2',
      time: '11:00 - 12:30',
      title: 'Advanced Diagnostic Techniques',
      speaker: 'Dr. Michael Chen',
      location: 'Conference Room 1',
      category: 'Session',
    },
    {
      id: '3',
      time: '14:00 - 15:30',
      title: 'Clinical Research Updates',
      speaker: 'Prof. Emma Williams',
      location: 'Main Hall B',
      category: 'Session',
    },
  ],
  day2: [
    {
      id: '4',
      time: '09:00 - 10:30',
      title: 'Immunotherapy Breakthroughs',
      speaker: 'Dr. Robert Martinez',
      location: 'Main Hall A',
      category: 'Session',
    },
    {
      id: '5',
      time: '11:00 - 12:30',
      title: 'Workshop: Data Analysis Methods',
      speaker: 'Dr. Lisa Anderson',
      location: 'Conference Room 2',
      category: 'Workshop',
    },
  ],
  day3: [
    {
      id: '6',
      time: '09:00 - 10:30',
      title: 'Personalized Treatment Approaches',
      speaker: 'Prof. James Wilson',
      location: 'Main Hall A',
      category: 'Session',
    },
    {
      id: '7',
      time: '11:00 - 12:30',
      title: 'Future of Healthcare Technology',
      speaker: 'Dr. Amanda Thompson',
      location: 'Conference Room 1',
      category: 'Session',
    },
  ],
}

function SessionCard({ session }: { session: Session }) {
  return (
    <Card className="bg-card border-l-4 border-l-accent border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-navy" />
              <span className="font-mono font-bold text-navy text-sm">{session.time}</span>
            </div>
            <CardTitle className="text-lg">{session.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Speaker:</span>{' '}
            <span className="text-accent font-medium">{session.speaker}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Location:</span> {session.location}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProgramSection() {
  return (
    <section id="program" className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-2">Conference Program</h2>
          <p className="text-muted-foreground">
            Browse sessions and keynotes across all conference days
          </p>
        </div>

        {/* <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted border border-border">
            <TabsTrigger
              value="day1"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Day 1
            </TabsTrigger>
            <TabsTrigger
              value="day2"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Day 2
            </TabsTrigger>
            <TabsTrigger
              value="day3"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Day 3
            </TabsTrigger>
          </TabsList>

          <TabsContent value="day1" className="mt-6 space-y-4">
            {sessionsByDay.day1.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </TabsContent>

          <TabsContent value="day2" className="mt-6 space-y-4">
            {sessionsByDay.day2.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </TabsContent>

          <TabsContent value="day3" className="mt-6 space-y-4">
            {sessionsByDay.day3.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </TabsContent>
        </Tabs> */}
      </div>
    </section>
  )
}
