'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/payload-types'

interface MessageSectionProps {
  conference: Post
  resident?: {
    id: number
    name: string
    role: string
    email?: string
    avatar?: string
  }
}

export function MessageSection({ conference, resident: member }: MessageSectionProps) {
  const duration =
    conference.startDate && conference.endDate
      ? Math.round(
          (new Date(conference.endDate).getTime() - new Date(conference.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + ' Days'
      : '—'
  return (
    <section id="message" className="py-12 sm:py-16 bg-background scroll-mt-[132px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Message from Organizing Committee */}
          <div className="lg:col-span-2">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-navy text-3xl font-bold mb-4">
                Message from Organizing Committee
              </h2>
              <div className="text-muted-foreground space-y-4 leading-relaxed">
                <p>{}</p>
                <p>{}</p>
                <p>{}</p>
              </div>

              {/* Committee Members */}
              {member?.avatar && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-navy text-lg font-semibold mb-6">Organizing Committee</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-accent/30">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-accent/20 text-navy font-semibold">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy text-sm truncate">{member.name}</p>
                        <p className="text-xs text-accent font-medium mb-1">{member.role}</p>
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-xs text-muted-foreground hover:text-accent transition-colors truncate"
                          >
                            {member.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Facts Card */}
          <div>
            <Card className="bg-card border-border h-full">
              <CardHeader>
                <CardTitle className="text-navy">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-semibold text-foreground">{duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expected Attendees</p>
                  <p className="font-semibold text-foreground">-</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Scientific Sessions</p>
                  <p className="font-semibold text-foreground">{conference.topics?.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Keynote Speakers</p>
                  <p className="font-semibold text-foreground">-</p>
                </div>
                {/* <div>
                  <p className="text-sm text-muted-foreground mb-1">CME Credits</p>
                  <p className="font-semibold text-accent"></p>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
