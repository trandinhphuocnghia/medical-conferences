import { Post, Topic } from '@/payload-types'
import { AuthorTop } from './author-top'
import { CreateAbstractForm } from './create-abstract-form'
import TopicListMenu from './topic-list-menu'
import { TopicSection } from './topic-section'

export default function PostContent({ post }: { post: Post }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="flex gap-8 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <TopicListMenu topics={post?.topics as Topic[]} />
        <article className="flex-1 max-w-4xl">
          <AuthorTop author={post?.createdBy} createdAt={post?.createdAt} />
          {(post?.topics as Topic[])?.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
        </article>
      </div>

      <div className="flex flex-col border-t gap-8 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="font-bold">Call for an abstract</p>
        <CreateAbstractForm topics={(post.topics as Topic[]) || []} />
      </div>
    </main>
  )
}
