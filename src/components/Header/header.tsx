'use client'

import { UserMenu } from '@/Header/UserMenu'
import type { Header } from '@/payload-types'
import { useUserStore } from '@/stores/userStore'
import { Logo } from '../Logo/Logo'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Conferences', href: '/posts' },
  { label: 'About', href: '/#about' },
  { label: 'Speakers', href: '/#speakers' },
  { label: 'Schedule', href: '/#schedule' },
  { label: 'Venue', href: '/#venue' },
] as const

export const HeaderClient = ({ data: _data }: { data: Header }) => {
  const { user } = useUserStore((state) => state)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
            <span className="font-bold text-xl tracking-tight text-foreground uppercase">HIGCF</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <UserMenu />
            ) : (
              <Link
                href="/signin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
