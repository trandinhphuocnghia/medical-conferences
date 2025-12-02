'use client'

import { Abstract, Post, Topic } from '@/payload-types'
import { useUserStore } from '@/stores/userStore'
import Link from 'next/link'
import { AuthorTop } from './author-top'
import ConferenceOverview from './conference-overview'
import EventTimeline from './conference-timeline'
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

  const submissionDeadline = post.abstractSubmissionDeadline
    ? new Date(post.abstractSubmissionDeadline)
    : null

  const isSubmissionOpen = submissionDeadline && new Date() < submissionDeadline

  return (
    <main className="min-h-screen bg-background">
      <div className="flex gap-8 mx-auto max-w-[1440px] py-12 px-4">
        <TopicListMenu topics={post?.topics as Topic[]} />
        <article className="flex-1 max-w-5xl">
          <ConferenceOverview post={post} />
          <EventTimeline {...post} />

          <AuthorTop author={post?.createdBy} createdAt={post?.createdAt} />
          {(post?.topics as Topic[])?.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
          <div
            id="abstract-form"
            className="flex flex-col border-t gap-8 mx-auto max-w-6xl pt-12"
          >
            <h2 className="font-bold text-2xl">Call for an abstract</h2>
            {isSubmissionOpen ? (
              <>
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
              </>
            ) : (
              <p className="text-red-600 font-semibold p-4 bg-red-50 border border-red-200 rounded-md">
                The abstract submission period has closed as of{' '}
                {submissionDeadline?.toLocaleDateString()}
                {' at '}
                {submissionDeadline?.toLocaleTimeString()}.
              </p>
            )}
          </div>
        </article>
        <TopicAbstractList abstracts={abstracts as Abstract[]} />
      </div>
    </main>
  )
}
