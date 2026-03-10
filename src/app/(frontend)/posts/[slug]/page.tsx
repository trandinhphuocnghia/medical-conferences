import { getHighlightPresenters } from '@/app/actions/conferences/getHighlightPresenters'
import { getConferenceBySlug } from '@/app/actions/conferences/getConferenceBySlug'
import type { Post, Topic } from '@/payload-types'
import { DetailHeader } from './components/detail-header'
import { PresentersSection } from './components/presenters-section'
import { MessageSection } from './components/president-message'
import { ScientificTimeline } from './components/scientific-timeline'
import { StickySubNav } from './components/sticky-subnav'
import { TopicExplorer } from './components/topic-exploer'

const getTopics = (conference: Post): Topic[] => {
  if (!conference.topics) return []
  return conference.topics.filter((t): t is Topic => typeof t === 'object' && t !== null)
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

//[NEED REVIEW] [CLAUDE]: This component is in use on develop,
//TODO: when the claude is working again should review the code.
export default async function ConferenceDetailPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  const posts = await getConferenceBySlug({ slug })
  const conferenceData = posts?.docs?.[0]

  if (!conferenceData) return null

  const topics = getTopics(conferenceData)

  const [presentersData] = await Promise.all([
    //getConferencePresenters(conferenceData.id), // This was commented out, so the import is unused.
    getHighlightPresenters(conferenceData.id),
  ])

  return (
    <div className="min-h-screen bg-background">
      <StickySubNav />

      <DetailHeader
        conference={conferenceData}
        attendees={0} //TODO
        cmeCredits={0} //TODO
      />

      <MessageSection conference={conferenceData} />

      <ScientificTimeline
        abstractSubmissionDeadline={conferenceData.abstractSubmissionDeadline}
        notificationOfAcceptanceDate={conferenceData.notificationOfAcceptanceDate}
        earlyRegistrationDeadline={conferenceData.earlyRegistrationDeadline}
        startDate={conferenceData.startDate}
        endDate={conferenceData.endDate}
      />

      {topics.length > 0 && <TopicExplorer conferenceId={conferenceData.id} topics={topics} />}

      <PresentersSection presenters={presentersData.presenters} highlightPresenters={[]} />

      {/* <LogisticsBento
        conference={conferenceData}
        venueAddress="513 Yeongdong-daero, Gangnam-gu, Seoul 06164"
        floorPlanUrl="#"
      /> */}
    </div>
  )
}
