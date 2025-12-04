import { Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload, PaginatedDocs, Where } from 'payload'

export async function getConferences({ search }: { search?: string }) {
  try {
    const payload = await getPayload({ config: configPromise })

    let defaultQuery: Where = {
      active: {
        equals: true,
      },
    }
    if (search) {
      defaultQuery = {
        ...defaultQuery,
        and: [
          {
            title: {
              contains: search,
            },
          },
        ],
      }
    }

    const res = await payload?.find({
      collection: 'posts',
      draft: false,
      depth: 1,
      where: defaultQuery,
      sort: '-createdAt',
      limit: 10,
      overrideAccess: true,
      pagination: true,
      select: {
        title: true,
        slug: true,
        description: true,
        categories: true,
        meta: true,
        startDate: true,
      },
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
