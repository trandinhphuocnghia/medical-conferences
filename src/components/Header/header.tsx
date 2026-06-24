'use client'

import { UserMenu } from '@/Header/UserMenu'
import type { Header } from '@/payload-types'
import { useUserStore } from '@/stores/userStore'
import { Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '../Logo/Logo'

// A simple hook abstraction for translation that can be easily replaced by any i18n library (e.g., next-intl, react-i18next) in the future.
const useTranslation = () => {
  const t = (key: string, defaultValue: string) => defaultValue
  return { t }
}

const PRIMARY_NAV_ITEMS = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'conference', label: 'Conference', href: '/posts' },
  { key: 'trainingCourse', label: 'Training Course', href: '/courses' },
  { key: 'research', label: 'Research', href: '#' },
] as const

const ASSOCIATIONS = [
  { key: 'vsgc', label: 'Vietnamese Society of Gastric Surgery', href: '#' },
  {
    key: 'irgca',
    label: 'Related to International and Regional Gastric Cancer Association',
    href: '#',
  },
  { key: 'vlass', label: 'VLASS', href: '#' },
] as const

const AssociationsDropdown = () => {
  const { t } = useTranslation()

  return (
    <div className="relative group py-2">
      <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer">
        <span>{t('associations', 'Associations')}</span>
        <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
      </button>
      <div className="absolute z-100 left-0 top-full mt-1 w-80 rounded-md border border-border bg-background p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="flex flex-col gap-1">
          {ASSOCIATIONS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block p-3 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-normal leading-normal"
            >
              {t(item.key, item.label)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const HeaderClient = ({ data: _data }: { data: Header }) => {
  const { user } = useUserStore((state) => state)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAssociationsOpen, setMobileAssociationsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-100 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 p-1 focus:outline-none">
              <Logo className="h-10 w-auto" />
              <span className="font-bold text-xl tracking-tight text-foreground uppercase">
                HIGCF
              </span>
            </Link>

            {/* Desktop Navigation (lg breakpoints) */}
            <nav className="hidden lg:flex items-center space-x-8">
              {PRIMARY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {t(item.key, item.label)}
                </Link>
              ))}

              {/* Associations Dropdown */}
              <AssociationsDropdown />

              <Link
                href="/#contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {t('contactUs', 'Contact Us')}
              </Link>
            </nav>

            {/* CTA / User Menu (lg breakpoints) */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/signin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('signIn', 'Sign In')}
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle (default: visible, hidden on lg) */}
            <button
              className="lg:hidden p-2 -mr-2 text-foreground focus:outline-none cursor-pointer min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (full-screen overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[150] bg-background flex flex-col lg:hidden overflow-y-auto">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2 p-1" onClick={() => setMobileMenuOpen(false)}>
              <Logo className="h-10 w-auto" />
              <span className="font-bold text-xl tracking-tight text-foreground uppercase">
                HIGCF
              </span>
            </Link>
            <button
              className="p-2 -mr-2 text-foreground focus:outline-none cursor-pointer min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>

          {/* Mobile Drawer Navigation Content */}
          <div className="flex-1 px-4 sm:px-6 py-6 flex flex-col justify-between">
            <nav className="flex flex-col space-y-4">
              {PRIMARY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center min-h-[44px] p-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.key, item.label)}
                </Link>
              ))}

              {/* Associations Nested Mobile Menu */}
              <div className="flex flex-col">
                <button
                  className="flex items-center justify-between w-full min-h-[44px] p-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
                  onClick={() => setMobileAssociationsOpen(!mobileAssociationsOpen)}
                >
                  <span>{t('associations', 'Associations')}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${mobileAssociationsOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {mobileAssociationsOpen && (
                  <div className="mt-1 ml-4 border-l border-border pl-2 flex flex-col space-y-1">
                    {ASSOCIATIONS.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className="block min-h-[44px] p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors whitespace-normal leading-normal"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.key, item.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/#contact"
                className="flex items-center min-h-[44px] p-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('contactUs', 'Contact Us')}
              </Link>
            </nav>

            {/* Mobile User Menu / CTA */}
            <div className="pt-6 border-t border-border mt-8">
              {user ? (
                <div className="flex items-center justify-between p-3 min-h-[44px] rounded-md bg-muted/50">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {user.fullname}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                  <UserMenu />
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center justify-center min-h-[44px] w-full p-3 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('signIn', 'Sign In')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}




