import { getConferences } from '@/app/actions/conferences/getConferences'
import { generateMetadata } from '../[slug]/page'
import { Homepage } from './components/homepage'

export default async function Home({}: {
  searchParams: Promise<{ search?: string }>
}) {
  const posts = await getConferences({})

  const conferences = posts?.docs

  return <Homepage conferences={conferences} />
}

export { generateMetadata }
