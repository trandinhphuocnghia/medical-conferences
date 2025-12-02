'use client'

import { Abstract, Post, Topic } from '@/payload-types'
import { AuthorTop } from './author-top'
import ConferenceOverview from './conference-overview'
import EventTimeline from './conference-timeline'
import TopicAbstractList from './topic-abstract'
import TopicListMenu from './topic-list-menu'
import { TopicSection } from './topic-section'
import { Separator } from '@/components/ui/separator'
import { CallAbstractSection } from './call-abstract-section'

export default function PostContent({
  post,
  abstracts,
}: {
  post: Post
  abstracts: Omit<Abstract, 'conference'>[]
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex gap-8 mx-auto max-w-[1440px] py-12 px-4">
        <TopicListMenu topics={post?.topics as Topic[]} />
        <article className="flex-1 max-w-5xl">
          <AuthorTop author={post?.createdBy} createdAt={post?.createdAt} />
          <Separator className="my-6" />
          {(post?.topics as Topic[])?.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
          <Separator className="my-6" />
          <ConferenceOverview post={post} />
          <EventTimeline {...post} />
          <CallAbstractSection post={post} />
        </article>
        <TopicAbstractList abstracts={abstracts as Abstract[]} />
      </div>
    </main>
  )
}
