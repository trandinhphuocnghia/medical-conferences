import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Category, Media } from '@/payload-types'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ConferenceCardProps {
  post: {
    id: number
    title: string
    banner?: ((number | null) | Media) | undefined
    categories?: (number | Category)[] | null | undefined
    meta?:
      | {
          title?: string | null
          image?: (number | null) | Media
          description?: string | null
        }
      | undefined
    slug?: string | null | undefined
  }
}

export default function ConferenceCard({ post }: ConferenceCardProps) {
  return (
    <Card
      key={post.id}
      className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0 cursor-pointer hover:shadow-lg duration-200"
    >
      <div className="aspect-16/9 w-full">
        <Link
          href={`/posts/${post.slug}`}
          className="fade-in transition-opacity duration-200 hover:opacity-70"
        >
          <Image
            src={(post.banner as Media)?.url || '/assets/img/img-placeholder.png'}
            alt={post.title || 'image'}
            className="w-full h-56 object-cover object-center rounded-t-lg"
            width={400}
            height={200}
          />
        </Link>
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold hover:underline md:text-xl">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{post.meta?.description}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/posts/${post.slug}`}
          className="text-foreground flex items-center hover:underline"
        >
          Read more
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
