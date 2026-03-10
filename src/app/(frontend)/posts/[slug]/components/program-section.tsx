'use client'


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
