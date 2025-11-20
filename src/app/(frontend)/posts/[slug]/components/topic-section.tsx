import { Topic } from '@/payload-types'
import RichText from '@/components/RichText'

export function TopicSection({ topic }: { topic: Topic }) {
  return (
    <section id={topic.id.toString()} className="mb-16">
      <h1 className="text-3xl font-bold py-4">{topic.name}</h1>
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
