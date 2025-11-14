import { Topic } from '@/payload-types'
import RichText from '@/components/RichText'

export function TopicSection({ topic }: { topic: Topic }) {
  return (
    <section id={topic.id.toString()} className="mb-16">
      <h2 className="text-3xl font-bold mb-4 py-4">{topic.name}</h2>
      {topic.content && (
        <RichText
          className="max-w-full mx-auto"
          data={topic.content}
          enableGutter={false}
        />
      )}
    </section>
  )
}
