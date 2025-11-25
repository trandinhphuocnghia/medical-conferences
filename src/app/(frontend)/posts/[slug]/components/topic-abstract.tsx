'use client'

import { Abstract, Topic } from '@/payload-types'
import { CheckCircle, ChevronRight, CircleDashed, XCircle } from 'lucide-react'
import Link from 'next/link'
import ScrollSpy from 'react-scrollspy-navigation'

export default function TopicAbstractList({
  abstracts = [],
}: {
  abstracts: Abstract[]
}) {
  return (
    <aside className="shrink-0 hidden lg:block">
      <nav className="sticky top-8 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          All your paper
        </p>
        <div className="flex flex-col gap-1">
          <ScrollSpy
            offsetTop={20}
            rootMargin="-60px 0px 0px 0px"
            activeClass="bg-primary/10 text-primary font-medium"
          >
            {abstracts.map((abstract) => (
              <div
                className="w-full items-center gap-2 min-w-56 flex"
                key={abstract.id}
              >
                <a
                  className={`w-full cursor-pointer text-left text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground`}
                  href={`#${(abstract.topic as Topic)?.id?.toString()}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <p>{abstract.title}</p>
                    <AbstractStatus status={abstract.status} />
                  </div>
                </a>

                <Link
                  title="go to detail"
                  href={`/dashboard/collections/abstracts/${abstract.id}`}
                >
                  <ChevronRight className="w-6" />
                </Link>
              </div>
            ))}
          </ScrollSpy>
        </div>
      </nav>
    </aside>
  )
}

//status: 'pending' | 'verified' | 'rejected';
const AbstractStatus = ({ status }: { status: string }) => {
  if (status === 'verified') {
    return <CheckCircle color="green" />
  }

  if (status === 'rejected') {
    return <XCircle color="red" />
  }

  return <CircleDashed color="yellow" />
}
