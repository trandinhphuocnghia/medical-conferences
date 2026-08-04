import type { Metadata } from 'next'
import { cache } from 'react'

import { getConferenceBySlug } from '@/app/actions/conferences/getConferenceBySlug'
import { getHighlightPresenters } from '@/app/actions/conferences/getHighlightPresenters'
import { getConferencePresenters } from '@/app/actions/abstracts/getConferencePresenters'
import type { Post, Sponsor, Topic } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { SponsorSection } from './components/conference-sponsor'
import { DetailHeader } from './components/detail-header'
import { PresentersSection } from './components/presenters-section'
import { MessageSection } from './components/president-message'
import { ScientificTimeline } from './components/scientific-timeline'
import { StickySubNav } from './components/sticky-subnav'
import { TopicAccordion } from './components/topic-accordion'
import { CountdownTimer } from './components/countdown-timer'
import { ProgramPreviewCard } from './components/program-preview-card'
import RoboticPosterSection from './components/hero-section'

const getTopics = (conference: Post): Topic[] => {
  if (!conference.topics) return []
  return conference.topics.filter((t): t is Topic => typeof t === 'object' && t !== null)
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const queryConferenceBySlug = cache(async (slug: string) => {
  const res = await getConferenceBySlug({ slug })
  return res?.docs?.[0] || null
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const { slug = '' } = await paramsPromise
    const doc = await queryConferenceBySlug(slug)

    return generateMeta({
      doc: {
        meta: {
          title: doc?.title,
        }
      }
    })
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'HIGCF',
      description: '',
    }
  }
}

//[NEED REVIEW] [CLAUDE]: This component is in use on develop,
//TODO: when the claude is working again should review the code.
export default async function ConferenceDetailPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const conferenceData = await queryConferenceBySlug(slug)

  if (!conferenceData) return null

  const topics = getTopics(conferenceData)
  const sponsors =
    conferenceData.sponsors?.filter((s): s is Sponsor => typeof s === 'object' && s !== null) || []

  const [presentersData, highlightData] = await Promise.all([
    getConferencePresenters(conferenceData.id),
    getHighlightPresenters(conferenceData.id),
  ])

  const isSubmissionOpen =
    conferenceData.abstractSubmissionDeadline &&
    new Date() < new Date(conferenceData.abstractSubmissionDeadline)

  return (
    <div className="min-h-screen bg-background">
      <StickySubNav
        conferenceId={conferenceData?.id}
        slug={slug}
        isSubmissionOpen={!!isSubmissionOpen}
      />

      <DetailHeader
        conference={conferenceData}
        attendees={0} //TODO
        cmeCredits={0} //TODO
      />

      <RoboticPosterSection
        presenters={highlightData.presenters}
        programAgenda={conferenceData.programAgenda}
      />

      <CountdownTimer targetDate={conferenceData.startDate} />

      <MessageSection conference={conferenceData} />

      <ScientificTimeline
        abstractSubmissionDeadline={conferenceData.abstractSubmissionDeadline}
        notificationOfAcceptanceDate={conferenceData.notificationOfAcceptanceDate}
        earlyRegistrationDeadline={conferenceData.earlyRegistrationDeadline}
        startDate={conferenceData.startDate}
        endDate={conferenceData.endDate}
        abstractDeadlineExtended={conferenceData.abstractDeadlineExtended}
        previousAbstractDeadline={conferenceData.previousAbstractDeadline}
        notificationDateChanged={conferenceData.notificationDateChanged}
        previousNotificationDate={conferenceData.previousNotificationDate}
      />

      {topics.length > 0 && (
        <TopicAccordion
          conferenceId={conferenceData.id}
          topics={topics}
          isSubmissionOpen={!!isSubmissionOpen}
        />
      )}

      <ProgramPreviewCard slug={slug} program={conferenceData.program} />

      <PresentersSection presenters={presentersData.presenters} highlightPresenters={[]} />


      <SponsorSection sponsors={sponsors} />
    </div>
  )
}
