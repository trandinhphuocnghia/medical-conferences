import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'

import { getConferenceAbstracts } from '@/app/actions/abstracts/getConferenceAbstracts'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PostContent from './components/post-content'
import { getConferenceBySlug } from '@/app/actions/conferences/getConferenceBySlug'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise

  const { isEnabled: draft } = await draftMode()

  const posts = await getConferenceBySlug({ slug })
  const url = '/posts/' + slug

  const post = posts?.docs?.[0]

  if (!post) return <PayloadRedirects url={url} />

  const abstractRes = await getConferenceAbstracts({
    conferenceId: post.id,
  })

  return (
    <article className="pt-16 pb-16">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <PostContent post={post} abstracts={abstractRes?.abstracts || []} />
    </article>
  )
}
