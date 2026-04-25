'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface StickySubNavProps {
  conferenceId: number
  slug: string
}

export function StickySubNav({ conferenceId, slug }: StickySubNavProps) {
  const [isSticky, setIsSticky] = useState(false)
  const pathname = usePathname()

  // Determine if we're on a sub-page (e.g. /posts/my-conference/program)
  const conferenceBasePath = `/posts/${slug}`
  const isSubPage = pathname !== conferenceBasePath

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Overview', href: `${conferenceBasePath}#overview` },
    { label: 'Message', href: `${conferenceBasePath}#message` },
    { label: 'Timeline', href: `${conferenceBasePath}#timeline` },
    { label: 'Topics', href: `${conferenceBasePath}#topics` },
    { label: 'Program', href: `${conferenceBasePath}/program` },
    { label: 'Speakers', href: `${conferenceBasePath}#speakers` },
    {
      label: 'Call for Abstract',
      href: `/submit-abstract?conference=${conferenceId}`,
    },
    {
      label: 'Registration',
      href: `/registration?conference=${conferenceId}`,
    },
    { label: 'Information', href: `${conferenceBasePath}/information` },
    { label: 'Sponsors', href: `${conferenceBasePath}#sponsors` },
  ]

  return (
    <nav
      className={`transition-all duration-300 ${isSticky
        ? 'fixed top-16 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border shadow-sm'
        : 'relative bg-card border-b border-border'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 overflow-x-auto pb-2 sm:pb-0">

            {navItems.map((item, index) => (
              <Link
                key={item.href + index}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-muted/50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
