'use client'

import { RichTextParser } from '@/components/RichTextParser'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import type { Topic } from '@/payload-types'
import { Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface TopicAccordionProps {
  topics: Topic[]
  conferenceId: number
}

export function TopicAccordion({ topics, conferenceId }: TopicAccordionProps) {
  const router = useRouter()

  const onSubmitAbstract = useCallback(
    async (topicId: number | string) => {
      // Check if user is logged in
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        const data = await res.json()
        if (data?.user) {
          // Logged-in → go to admin panel create form
          router.push(
            `/dashboard/collections/abstracts/create?conference=${conferenceId}&topic=${topicId}`,
          )
        } else {
          // Anonymous → go to public form with pre-selection
          router.push(`/submit-abstract?conference=${conferenceId}&topic=${topicId}`)
        }
      } catch {
        // Network error fallback → public form
        router.push(`/submit-abstract?conference=${conferenceId}&topic=${topicId}`)
      }
    },
    [conferenceId, router],
  )

  if (!topics || topics.length === 0) {
    return null
  }

  return (
    <section id="topics" className="py-8 sm:py-12 scroll-mt-[132px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Scientific Topics</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore the key research areas and medical topics covered at this conference.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {topics.map((topic, index) => (
            <AccordionItem
              key={topic.id}
              value={`topic-${index}`}
              className="border border-border rounded-lg bg-card px-4 sm:px-6 overflow-hidden"
            >
              <AccordionTrigger className="hover:text-accent py-5 no-underline hover:no-underline">
                <div className="text-left pr-4">
                  <h3 className="font-semibold text-navy text-lg leading-snug">{topic.name}</h3>
                  {topic.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {topic.description}
                    </p>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="bg-slate-50/50 rounded-xl p-5 sm:p-6 border border-slate-100">
                  <div className="prose prose-slate max-w-none text-sm sm:text-base mb-6">
                    {topic.description && (
                      <p className="font-medium text-slate-800 mb-4">{topic.description}</p>
                    )}
                    {topic.content ? (
                      <RichTextParser content={topic.content} />
                    ) : (
                      <p className="text-slate-500 italic">
                        Explore this research area through presentations, methodologies, and future
                        directions.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <p className="text-xs sm:text-sm text-slate-500">
                      Interested in presenting your research on this topic?
                    </p>
                    <Button
                      onClick={() => onSubmitAbstract(topic.id)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                      Submit Abstract
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {/* Other Topic Option */}
          <AccordionItem
            value="topic-other"
            className="border border-border rounded-lg bg-card px-4 sm:px-6 overflow-hidden"
          >
            <AccordionTrigger className="hover:text-accent py-5 no-underline hover:no-underline">
              <div className="text-left pr-4">
                <h3 className="font-semibold text-navy text-lg leading-snug">Other Topic</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="bg-slate-50/50 rounded-xl p-5 sm:p-6 border border-slate-100">
                <div className="prose prose-slate max-w-none text-sm sm:text-base mb-6">
                  <p className="text-slate-700">
                    If your research falls outside the specific topics listed above, we still
                    encourage you to submit. Please select this option and specify your topic
                    details in the submission form.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <p className="text-xs sm:text-sm text-slate-500">
                    Have a unique research topic to share?
                  </p>
                  <Button
                    onClick={() => onSubmitAbstract('other')}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    Submit Other Topic
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
