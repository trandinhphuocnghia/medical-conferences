'use client'

import { HeaderNav } from '@/Header/Nav'
import { UserMenu } from '@/Header/UserMenu'
import type { Header } from '@/payload-types'
import { useUserStore } from '@/stores/userStore'
import Link from 'next/link'
import { LogoSvg } from '../Logo'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Events', href: '#events' },
  { label: 'Sponsors', href: '#sponsors' },
] as const

export const HeaderClient = ({ data }: { data: Header }) => {
  const { user } = useUserStore((state) => state)

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200/80 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 sm:px-8 md:px-10 py-3">
      <LogoSvg />

      <nav className="hidden md:flex flex-1 justify-center items-center gap-9">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <HeaderNav data={data} />
      {user ? <UserMenu /> : <Link href="/signin">Sign In</Link>}
    </header>
  )
}
