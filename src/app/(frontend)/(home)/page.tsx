import { generateMetadata } from '../[slug]/page'

import { getConferences } from '@/app/actions/conferences/getConferences'
import { Homepage } from './components/homepage'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const searchParamsValues = await searchParams
  const { docs: posts } = await getConferences({
    search: searchParamsValues?.search,
  })

  return <Homepage />
}

export { generateMetadata }
