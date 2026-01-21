import { Seat } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload, PaginatedDocs, Where } from 'payload'

export async function getSeatsByRoomId({ id: roomId }: { id?: string }) {
  try {
    const payload = await getPayload({ config: configPromise })

    const defaultQuery: Where = {
      room: {
        equals: roomId,
      },
    }

    const res = await payload?.find({
      collection: 'seats',
      draft: false,
      where: defaultQuery,
      sort: '-createdAt',
      limit: 10,
      overrideAccess: true,
      pagination: true,
    })

    return res
  } catch {
    return {
      docs: [] as Seat[],
      page: 0,
      totalPages: 0,
    } as PaginatedDocs<Seat>
  }
}
