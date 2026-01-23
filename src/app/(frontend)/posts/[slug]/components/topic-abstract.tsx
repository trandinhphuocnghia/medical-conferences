'use client'

import InfoIcon from '@/components/common/info-icon'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Abstract } from '@/payload-types'
import { CheckCircle, CircleDashed, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function TopicAbstractList({
  abstracts = [],
}: {
  abstracts: Abstract[]
}) {
  return (
    <aside className="shrink-0 hidden lg:block w-60">
      <nav className="sticky top-12 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground tracking-wide mb-4">
          <p className="uppercase text-xs font-semibold">All your paper</p>{' '}
          <InfoIcon content="All your paper submitted to this conference" />
        </div>
        <div className="flex flex-col gap-1">
          {abstracts.map((abstract) => (
            <div className="w-full items-center flex" key={abstract.id}>
              <div
                className={`w-full cursor-pointer text-left text-sm py-2 rounded-md transition-colors text-muted-foreground hover:text-foreground`}
              >
                <Link
                  title="Submition detail"
                  href={`/dashboard/collections/abstracts/${abstract.id}`}
                  className="flex w-full items-center justify-between gap-1"
                  target="_blank"
                >
                  <p>{abstract.title}</p>
                  <Tooltip>
                    <TooltipTrigger>
                      {/* <AbstractStatus status={abstract.status} /> */}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="capitalize">{abstract.status}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}

//status: 'pending' | 'verified' | 'rejected';
const AbstractStatus = ({ status }: { status: string }) => {
  if (status === 'verified') {
    return <CheckCircle color="green" className="size-5" />
  }

  if (status === 'rejected') {
    return <XCircle color="red" className="size-5" />
  }

  return <CircleDashed color="yellow" className="size-5" />
}
