'use client'

import { Separator } from '@/components/ui/separator'
import { Topic } from '@/payload-types'
import ScrollSpy from 'react-scrollspy-navigation'

export default function TopicListMenu({ topics = [] }: { topics: Topic[] }) {
  return (
    <aside className="w-60 shrink-0 hidden lg:block">
      <nav className="sticky top-12 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          On this page
        </p>
        <div className="flex flex-col gap-2">
          <ScrollSpy
            offsetTop={20}
            rootMargin="-60px 0px 0px 0px"
            activeClass="bg-primary/10 text-primary font-medium"
          >
            {topics.map((topic) => (
              <a
                key={topic.id}
                className={`w-full cursor-pointer text-left text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground`}
                href={`#${topic.id.toString()}`}
              >
                {topic.name}
              </a>
            ))}
            <Separator />
            <a
              key="abstract-form"
              className={`w-full cursor-pointer text-left text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground`}
              href="#abstract-form"
            >
              Call for an abstract
            </a>
          </ScrollSpy>
        </div>
      </nav>
    </aside>
  )
}
