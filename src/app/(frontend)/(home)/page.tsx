import { generateMetadata } from '../[slug]/page'

import { getConferences } from '@/app/actions/conferences/getConferences'
import { Homepage } from './components/homepage'

export default async function Home({}: {
  searchParams: Promise<{ search?: string }>
}) {
  return <Homepage />
}

export { generateMetadata }
