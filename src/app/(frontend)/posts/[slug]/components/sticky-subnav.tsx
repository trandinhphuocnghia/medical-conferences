'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function StickySubNav({ conferenceId }: { conferenceId: number }) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Message', href: '#message' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Speakers', href: '#speakers' },
    { label: 'Topics', href: '#topics' },
    // { label: 'Logistics', href: '#logistics' },
    {
      label: 'Registration',
      href: `/registration${conferenceId ? `?conference=${conferenceId}` : ''}`,
    },
  ]

  return (
    <nav
      className={`transition-all duration-300 ${
        isSticky
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
