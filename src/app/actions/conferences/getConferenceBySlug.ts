import { Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload, PaginatedDocs, Where } from 'payload'

export async function getConferenceBySlug({ slug }: { slug?: string }) {
  try {
    const payload = await getPayload({ config: configPromise })

    const defaultQuery: Where = {
      active: {
        equals: true,
      },
      slug: {
        equals: slug,
      },
    }

    const res = await payload?.find({
      collection: 'posts',
      draft: false,
      depth: 2,
      where: defaultQuery,
      sort: '-createdAt',
      limit: 10,
      overrideAccess: true,
      pagination: true,
    })

    return res
  } catch {
    return {
      docs: [] as Post[],
      page: 0,
      totalPages: 0,
    } as PaginatedDocs<Post>
  }
}
