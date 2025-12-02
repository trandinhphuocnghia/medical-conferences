import Link from 'next/link'
import { CreateAbstractForm } from './create-abstract-form'
import { useUserStore } from '@/stores/userStore'
import { Post, Topic } from '@/payload-types'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
} from '@/components/ui/alert'
import { Button } from '@payloadcms/ui'
import { CircleAlert } from 'lucide-react'

export const CallAbstractSection = ({ post }: { post: Post }) => {
  const { user } = useUserStore()
  const submissionDeadline = post.abstractSubmissionDeadline
    ? new Date(post.abstractSubmissionDeadline)
    : null

  const isSubmissionOpen = submissionDeadline && new Date() < submissionDeadline
  return (
    <div
      id="abstract-form"
      className="flex flex-col border-t gap-8 mx-auto max-w-6xl pt-12"
    >
      <h2 className="font-bold text-2xl">Call for abstract</h2>
      {isSubmissionOpen ? (
        <>
          {user ? (
            <CreateAbstractForm
              conferenceId={post.id}
              topics={(post.topics as Topic[]) || []}
            />
          ) : (
            <p>
              Please
              <Link
                href={`/signin?redirect=/post/${post.slug}`}
                className="underline"
              >
                login
              </Link>
              to submit an abstract
            </p>
          )}
        </>
      ) : (
        <Alert variant="destructive" appearance="light">
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertTitle>
            The abstract submission period has closed as of{' '}
            {submissionDeadline?.toLocaleDateString()}
            {' at '}
            {submissionDeadline?.toLocaleTimeString()}
          </AlertTitle>
        </Alert>
      )}
    </div>
  )
}
