'use client'
import { permanentRedirect } from 'next/navigation'

export default function Home({}: { searchParams: Promise<{ search?: string }> }) {
  // const [posts, currentConference] = await Promise.all([getConferences({}), getCurrentConference()])
  // return <Homepage conferences={posts?.docs ?? []} currentConference={currentConference} />
  permanentRedirect('/posts')
}

// export { generateMetadata }
