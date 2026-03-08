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
              <h2 className="text-navy text-3xl font-bold mb-1">
                Message from the Organizing Committee
              </h2>
              <p className="text-accent font-semibold text-base mb-6">
              Vo Duy Long
              </p>

              <div className="text-muted-foreground space-y-4 leading-relaxed">
                <p>Dear Esteemed Colleagues,</p>

                <p>
                  The University Medical Center at Ho Chi Minh City is honored to host the 6th
                  Meeting of the Ho Chi Minh City International Gastric Cancer Forum, to be held at
                  the University Medical Center Ho Chi Minh City.
                </p>

                <p>
                  Since its inaugural meeting in 2018, the Ho Chi Minh City International Gastric
                  Cancer Forum (formerly known as the{' '}
                  <em>Gastric Cancer Consensus Conference</em>) has become an annual scientific
                  forum of high prestige, bringing together surgeons, endoscopists, oncologists, and
                  leading experts from Vietnam and around the world to share clinical experience and
                  advances in gastric cancer research and treatment.
                </p>

                <p>
                  In Vietnam, the majority of gastric cancer patients are diagnosed at an advanced
                  stage. Therefore, the management of gastric cancer requires close multidisciplinary
                  collaboration within a multimodal treatment strategy. This year&apos;s conference
                  will focus on updating significant advances in preoperative assessment,
                  intraoperative techniques, and postoperative management, as well as discussing
                  contemporary multimodal treatment trends and novel surgical approaches. In
                  addition, one full day will be dedicated to live surgery sessions, featuring two
                  laparoscopic gastrectomy cases with standard lymphadenectomy using ICG for lymph
                  node navigation, and two endoscopic submucosal dissection (ESD) cases for
                  early-stage gastric cancer.
                </p>

                <p>
                  We are deeply honored to welcome 14 leading international experts in gastric
                  cancer from Japan, Korea, China, Taiwan, Chile, and Malaysia, along with
                  distinguished professors and experienced specialists from major hospitals across
                  Vietnam.
                </p>

                <p>
                  The University Medical Center at Ho Chi Minh City cordially invites you to attend
                  this meeting, taking place on May 14–16, 2026, in Ho Chi Minh City — a dynamic
                  hub and a pioneer in international integration.
                </p>

                <p>We look forward to welcoming you.</p>
              </div>

              {/* Host & Secretariat */}
              <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left: Conference Host */}
                <div>
                  <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-1">
                    Conference Host
                  </p>
                  <p className="font-semibold text-foreground text-sm leading-snug">
                    University Medical Center at Ho Chi Minh City
                  </p>
                </div>

                {/* Right: Conference Secretariat */}
                <div>
                  <p className="text-xs font-700 uppercase tracking-widest text-muted-foreground mb-1">
                    Conference Secretariat
                  </p>
                  <div className='flex flex-col gap-1'>
                    <a
                    href="mailto: nguyen.dt5@umc.edu.vn"
                    className="text-sm text-accent hover:underline transition-colors"
                  >
                     nguyen.dt5@umc.edu.vn
                  </a>
                  <a
                    href="mailto: phuoc.td@umc.edu.vn"
                    className="text-sm text-accent hover:underline transition-colors"
                  >
                     phuoc.td@umc.edu.vn
                  </a>
                  </div>
                
                </div>
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
