'use client'

import { Command, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
}: SearchHeaderProps) {
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById(
          'conference-search',
        ) as HTMLInputElement
        searchInput?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="w-full">
      {/* Bento Header */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white/70 backdrop-blur-xl p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] text-balance">
              Discover Medical Conferences
            </h1>
            <p className="text-[#0F172A]/60 text-lg">
              Browse upcoming conferences, workshops, and CME opportunities
              worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div
              className={`
                flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5
                transition-all duration-200
                ${
                  isFocused
                    ? 'border-[#06B6D4] ring-4 ring-[#06B6D4]/10'
                    : 'border-[#E2E8F0] hover:border-[#06B6D4]/50'
                }
              `}
            >
              <Search className="h-5 w-5 text-[#0F172A]/40" />
              <input
                id="conference-search"
                type="text"
                placeholder="Search conferences, topics, or speakers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 bg-transparent text-[#0F172A] placeholder:text-[#0F172A]/40 focus:outline-none text-base"
              />
              <div className="hidden md:flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1">
                <Command className="h-3.5 w-3.5 text-[#0F172A]/50" />
                <span className="font-mono text-xs text-[#0F172A]/50">K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
