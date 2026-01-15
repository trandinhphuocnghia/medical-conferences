import { getConferences } from '@/app/actions/conferences/getConferences'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import ConferenceCard from '../(home)/components/conference-card'
import PageClient from './page.client'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const searchParamsValues = await searchParams
  const posts = await getConferences({ search: searchParamsValues?.search })

  return (
    <div className="pt-24 pb-24 px-4">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>All Events</h1>
        </div>
      </div>

      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.docs.map((post) => (
          <ConferenceCard key={post.id} post={post} />
        ))}
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts?.page}
          limit={12}
          totalDocs={posts?.totalDocs}
        />
      </div>

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}
