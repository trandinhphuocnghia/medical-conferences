import { ArrowRight } from 'lucide-react'
import { generateMetadata } from '../[slug]/page'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import ConferenceCard from './components/conference-card'

export default async function Home() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      description: true,
      categories: true,
      meta: true,
      startDate: true,
    },
    where: {
      is_active: {
        equals: true,
      },
    },
  })

  return (
    <section className="py-12">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Upcoming Conferences
          </h2>
          <p className="text-muted-foreground mb-8 md:text-base lg:max-w-2xl lg:text-lg">
            {/* Explore the latest breakthroughs, clinical guidelines, and evidence-based practices in
            modern medicine. From novel therapeutics to emerging healthcare technology, stay at the
            forefront with insights from leading experts and peer-reviewed analysis. */}
            Join a community of leading professionals, researchers, and innovators. Discover
            cutting-edge research, share best practices, and help shape the future of patient care.
            Browse our articles and find your next essential event.
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild>
            <Link href="/posts">
              View all
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.docs.map((post) => (
            <ConferenceCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { generateMetadata }
