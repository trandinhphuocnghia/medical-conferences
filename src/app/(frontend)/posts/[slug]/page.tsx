import { getConferenceBySlug } from '@/app/actions/conferences/getConferenceBySlug'
import type { Post, Topic } from '@/payload-types'
import { DetailHeader } from './components/detail-header'
import { LogisticsBento } from './components/logistics-bento'
import { ScientificTimeline } from './components/scientific-timeline'
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

export default async function ConferenceDetailPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  const posts = await getConferenceBySlug({ slug })
  const conferenceData = posts?.docs?.[0]

  if (!conferenceData) return null

  const topics = getTopics(conferenceData)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DetailHeader
        conference={conferenceData}
        attendees={2500} //TODO
        cmeCredits={24} //TODO
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {topics.length > 0 && <TopicExplorer topics={topics} />}

        <ScientificTimeline
          abstractSubmissionDeadline={conferenceData.abstractSubmissionDeadline}
          notificationOfAcceptanceDate={conferenceData.notificationOfAcceptanceDate}
          earlyRegistrationDeadline={conferenceData.earlyRegistrationDeadline}
          startDate={conferenceData.startDate}
          endDate={conferenceData.endDate}
        />

        <LogisticsBento
          conference={conferenceData}
          venueAddress="513 Yeongdong-daero, Gangnam-gu, Seoul 06164"
          floorPlanUrl="#"
        />
      </main>
    </div>
  )
}
