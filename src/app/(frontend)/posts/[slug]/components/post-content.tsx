import { Abstract, Post, Topic } from '@/payload-types'
import { AuthorTop } from './author-top'
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
  return (
    <main className="min-h-screen bg-background">
      <div className="flex gap-8 mx-auto max-w-7xl py-12">
        <TopicListMenu topics={post?.topics as Topic[]} />
        <article className="flex-1 max-w-4xl">
          <AuthorTop author={post?.createdBy} createdAt={post?.createdAt} />
          {(post?.topics as Topic[])?.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
          <div
            id="abstract-form"
            className="flex flex-col border-t gap-8 mx-auto max-w-6xl py-12"
          >
            <h2 className="font-bold text-2xl">Call for an abstract</h2>
            <CreateAbstractForm
              conferenceId={post.id}
              topics={(post.topics as Topic[]) || []}
            />
          </div>
        </article>
        <TopicAbstractList abstracts={abstracts as Abstract[]} />
      </div>
    </main>
  )
}
