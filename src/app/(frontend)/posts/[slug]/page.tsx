import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getConferenceAbstracts } from '@/app/actions/abstracts/getConferenceAbstracts'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import PostContent from './components/post-content'
import { getConferences } from '@/app/actions/conferences/getConferences'
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
