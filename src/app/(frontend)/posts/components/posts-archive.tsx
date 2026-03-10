'use client'

import type { Post } from '@/payload-types'
import { ArrowLeft, Microscope } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Conference } from './conference-card'
import { ConferenceGrid } from './conference-grid'
import { FilterBar } from './filter-bar'
import { SearchHeader } from './search-header'

type PostsArchiveProps = {
  initialPosts: Post[]
}

const mapPostToConference = (post: Post): Conference => {
  // Mapping logic - placeholders for missing fields
  return {
    id: post.slug,
    title: post.title || 'Untitled Conference',
    date: post.startDate || new Date().toISOString(),
    dateDisplay: post.startDate
      ? new Date(post.startDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'TBD',
    location: post.venueCity || 'Unknown Location', // Assuming venueCity exists or using placeholder
    specialty: 'General', // Placeholder - maybe derive from Topics?
    seatsAvailable: 100, // Placeholder
    totalSeats: 200, // Placeholder
    cmeCredits: 10, // Placeholder
    isOnline: false, // Placeholder
  }
}

export function PostsArchive({ initialPosts }: PostsArchiveProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    specialty: 'All Specialties',
    location: 'All Locations',
    cmeCredits: 'Any CME Credits',
  })

  // Convert Payload Posts to UI Conferences
  const allConferences = useMemo(() => {
    return initialPosts.map(mapPostToConference)
  }, [initialPosts])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredConferences = useMemo(() => {
    return allConferences.filter((conf) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          conf.title.toLowerCase().includes(query) ||
          conf.specialty.toLowerCase().includes(query) ||
          conf.location.toLowerCase().includes(query) ||
          conf.id.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Specialty filter
      if (filters.specialty !== 'All Specialties') {
        if (conf.specialty !== filters.specialty) return false
      }

      // Location filter
      if (filters.location !== 'All Locations') {
        if (filters.location === 'Online' && !conf.isOnline) return false
        if (filters.location === 'Global' && conf.isOnline) return false
        if (
          filters.location === 'North America' &&
          !['Boston, MA', 'San Diego, CA', 'Chicago, IL', 'Toronto, Canada'].some((loc) =>
            conf.location.includes(loc.split(',')[0]),
          )
        )
          return false
        if (
          filters.location === 'Europe' &&
          !['Vienna, Austria', 'Barcelona, Spain'].some((loc) =>
            conf.location.includes(loc.split(',')[0]),
          )
        )
          return false
        if (filters.location === 'Asia Pacific' && !conf.location.includes('Singapore'))
          return false
      }

      // CME Credits filter
      if (filters.cmeCredits !== 'Any CME Credits') {
        const credits = conf.cmeCredits
        if (filters.cmeCredits === '1-10 Credits' && (credits < 1 || credits > 10)) return false
        if (filters.cmeCredits === '11-25 Credits' && (credits < 11 || credits > 25)) return false
        if (filters.cmeCredits === '26-50 Credits' && (credits < 26 || credits > 50)) return false
        if (filters.cmeCredits === '50+ Credits' && credits <= 50) return false
      }

      return true
    })
  }, [searchQuery, filters, allConferences])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#0F172A]/60 hover:text-[#06B6D4] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#06B6D4]/10">
                <Microscope className="h-4 w-4 text-[#06B6D4]" />
              </div>
              <span className="font-semibold text-[#0F172A]">HIGCF</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#0F172A]/50">
                {filteredConferences.length} conferences
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          {/* Search Header */}
          <SearchHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* Filter Bar */}
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#0F172A]/60">
              Showing
              <span className="font-semibold text-[#0F172A]">
                {filteredConferences.length}
              </span>{' '}
              conferences
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#0F172A]/50">Live availability</span>
            </div>
          </div>

          {/* Conference Grid */}
          <ConferenceGrid conferences={filteredConferences} />
        </div>
      </main>
    </div>
  )
}
