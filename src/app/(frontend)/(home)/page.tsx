import { generateMetadata } from '../[slug]/page'
import { Homepage } from './components/homepage'

export default async function Home({}: {
  searchParams: Promise<{ search?: string }>
}) {
  return <Homepage />
}

export { generateMetadata }
