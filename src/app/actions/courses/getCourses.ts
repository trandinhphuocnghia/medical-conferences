import type { Course } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload, PaginatedDocs, Where } from 'payload'

export async function getCourses({ search }: { search?: string } = {}) {
  try {
    const payload = await getPayload({ config: configPromise })

    let query: Where = {
      active: { equals: true },
    }

    if (search) {
      query = {
        ...query,
        and: [
          {
            title: { contains: search },
          },
        ],
      }
    }

    const res = await payload.find({
      collection: 'courses',
      draft: false,
      depth: 1,
      where: query,
      sort: '-createdAt',
      limit: 50,
      overrideAccess: true,
      pagination: true,
      select: {
        title: true,
        slug: true,
        course_type: true,
        target_audience: true,
        base_tuition_fee: true,
        schedules: true,
        active: true,
      },
    })

    return res
  } catch {
    return {
      docs: [] as Course[],
      page: 0,
      totalPages: 0,
    } as PaginatedDocs<Course>
  }
}
