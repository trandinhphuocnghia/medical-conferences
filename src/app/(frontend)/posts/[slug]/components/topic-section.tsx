import RichText from '@/components/RichText'
import { Topic } from '@/payload-types'

export function TopicSection({ topic }: { topic: Topic }) {
  return (
    <section id={topic.id.toString()}>
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
