import type { Metadata } from 'next'

// import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getConferenceAbstracts } from '@/app/actions/abstracts/getConferenceAbstracts'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { generateMeta } from '@/utilities/generateMeta'
import PostContent from './components/post-content'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload?.find({
    collection: 'posts',
    draft: false,
    limit: 5,
    overrideAccess: true,
    pagination: true,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map((doc) => {
    const slug = String(doc.slug)
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise

  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  const abstractRes = await getConferenceAbstracts({
    conferenceId: post.id,
  })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      {/* Allows redirects for valid pages too (optional, depends on use case) */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostContent post={post} abstracts={abstractRes?.abstracts || []} />
    </article>
  )
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise

  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  return result.docs?.[0] || null
})
