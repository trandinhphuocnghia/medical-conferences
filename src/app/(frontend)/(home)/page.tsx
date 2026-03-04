import { getConferences } from '@/app/actions/conferences/getConferences'
import { getCurrentConference } from '@/app/actions/conferences/getCurrentConference'
import { generateMetadata } from '../[slug]/page'
import { Homepage } from './components/homepage'

export default async function Home({}: { searchParams: Promise<{ search?: string }> }) {
  const [posts, currentConference] = await Promise.all([getConferences({}), getCurrentConference()])

  return <Homepage conferences={posts?.docs ?? []} currentConference={currentConference} />
}

export { generateMetadata }
