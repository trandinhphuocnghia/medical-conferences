import { getConferences } from '@/app/actions/conferences/getConferences'
import { PostsArchive } from './components/posts-archive'

export const dynamic = 'force-dynamic'

export default async function ConferencesPage() {
  const posts = await getConferences({})

  return <PostsArchive initialPosts={posts.docs} />
}
