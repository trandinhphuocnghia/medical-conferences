import { Topic } from '@/payload-types'
import RichText from '@/components/RichText'

export function TopicSection({ topic }: { topic: Topic }) {
  console.log({ content: topic?.content?.root })
  return (
    <section id={topic.id.toString()} className="mb-16">
      <h2 className="text-3xl font-bold mb-4 py-4">{topic.name}</h2>
      <a href="#">link</a>
      {topic.content && (
        <div className="prose">
          <RichText
            className="richtext max-w-full mx-auto"
            data={topic.content}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      )}
    </section>
  )
}
