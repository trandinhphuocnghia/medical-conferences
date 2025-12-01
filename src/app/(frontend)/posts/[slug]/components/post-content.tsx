'use client'

import { Abstract, Post, Topic } from '@/payload-types'
import { useUserStore } from '@/stores/userStore'
import Link from 'next/link'
import { AuthorTop } from './author-top'
import ConferenceOverview from './conference-overview'
import EventRoadmap from './conference-roadmap'
import { CreateAbstractForm } from './create-abstract-form'
import TopicAbstractList from './topic-abstract'
import TopicListMenu from './topic-list-menu'
import { TopicSection } from './topic-section'

export default function PostContent({
  post,
  abstracts,
}: {
  post: Post
  abstracts: Omit<Abstract, 'conference'>[]
}) {
  const { user } = useUserStore()
  return (
    <main className="min-h-screen bg-background">
      <div className="flex gap-8 mx-auto max-w-[1440px] py-12 px-4">
        <TopicListMenu topics={post?.topics as Topic[]} />
        <article className="flex-1 max-w-5xl">
          <ConferenceOverview
            host={post.host?.email}
            officialLanguage={''}
            secretariatEmail={''}
            theme={''}
            title={''}
            venue={post.venueCity}
          />
          <AuthorTop author={post?.createdBy} createdAt={post?.createdAt} />
          {(post?.topics as Topic[])?.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
          <EventRoadmap
            abstractSubmissionDeadline={post.abstractSubmissionDeadline}
            earlyRegistrationDeadline={post.earlyRegistrationDeadline}
            endDate={post.endDate}
            notificationOfAcceptanceDate={post.notificationOfAcceptanceDate}
            startDate={post.startDate}
          />
          <div
            id="abstract-form"
            className="flex flex-col border-t gap-8 mx-auto max-w-6xl pt-12"
          >
            <h2 className="font-bold text-2xl">Call for an abstract</h2>
            {user ? (
              <CreateAbstractForm
                conferenceId={post.id}
                topics={(post.topics as Topic[]) || []}
              />
            ) : (
              <p>
                Please
                <Link
                  href={`/signin?redirect=/post/${post.slug}`}
                  className="underline"
                >
                  login
                </Link>
                to submit an abstract
              </p>
            )}
          </div>
        </article>
        <TopicAbstractList abstracts={abstracts as Abstract[]} />
      </div>
    </main>
  )
}
