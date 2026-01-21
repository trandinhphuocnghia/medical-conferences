'use client'

import { ArrowLeft, Microscope } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Conference } from './components/conference-card'
import { ConferenceGrid } from './components/conference-grid'
import { FilterBar } from './components/filter-bar'
import { SearchHeader } from './components/search-header'

// Sample conference data
const conferenceData: Conference[] = [
  {
    id: 'ONCO-2026-001',
    title:
      'International Symposium on Precision Oncology and Targeted Therapies',
    date: '2026-03-15',
    dateDisplay: 'Mar 15-18, 2026',
    location: 'Boston, MA',
    specialty: 'Oncology',
    seatsAvailable: 45,
    totalSeats: 500,
    cmeCredits: 32,
    isOnline: false,
  },
  {
    id: 'CARD-2026-002',
    title: 'Global Cardiology Summit: Advances in Interventional Procedures',
    date: '2026-04-22',
    dateDisplay: 'Apr 22-25, 2026',
    location: 'Vienna, Austria',
    specialty: 'Cardiology',
    seatsAvailable: 120,
    totalSeats: 400,
    cmeCredits: 28,
    isOnline: false,
  },
  {
    id: 'NEUR-2026-003',
    title: 'Neuroscience & Brain Health Conference 2026',
    date: '2026-05-10',
    dateDisplay: 'May 10-13, 2026',
    location: 'Online',
    specialty: 'Neurology',
    seatsAvailable: 850,
    totalSeats: 1000,
    cmeCredits: 24,
    isOnline: true,
  },
  {
    id: 'IMMU-2026-004',
    title: 'Annual Immunology Research Forum: Autoimmune Disorders',
    date: '2026-06-05',
    dateDisplay: 'Jun 5-8, 2026',
    location: 'San Diego, CA',
    specialty: 'Immunology',
    seatsAvailable: 200,
    totalSeats: 350,
    cmeCredits: 20,
    isOnline: false,
  },
  {
    id: 'PEDI-2026-005',
    title: 'World Pediatrics Conference: Child Health Innovations',
    date: '2026-07-12',
    dateDisplay: 'Jul 12-15, 2026',
    location: 'Toronto, Canada',
    specialty: 'Pediatrics',
    seatsAvailable: 180,
    totalSeats: 300,
    cmeCredits: 26,
    isOnline: false,
  },
  {
    id: 'SURG-2026-006',
    title: 'Minimally Invasive Surgery Symposium & Workshop',
    date: '2026-08-20',
    dateDisplay: 'Aug 20-23, 2026',
    location: 'Singapore',
    specialty: 'Surgery',
    seatsAvailable: 60,
    totalSeats: 200,
    cmeCredits: 40,
    isOnline: false,
  },
  {
    id: 'RADI-2026-007',
    title: 'AI in Medical Imaging: Radiology Conference 2026',
    date: '2026-09-08',
    dateDisplay: 'Sep 8-11, 2026',
    location: 'Online',
    specialty: 'Radiology',
    seatsAvailable: 500,
    totalSeats: 800,
    cmeCredits: 18,
    isOnline: true,
  },
  {
    id: 'DERM-2026-008',
    title: 'International Dermatology Congress: Skin Cancer Prevention',
    date: '2026-10-15',
    dateDisplay: 'Oct 15-18, 2026',
    location: 'Barcelona, Spain',
    specialty: 'Dermatology',
    seatsAvailable: 90,
    totalSeats: 250,
    cmeCredits: 22,
    isOnline: false,
  },
  {
    id: 'ONCO-2026-009',
    title: 'Immunotherapy & CAR-T Cell Therapy Summit',
    date: '2026-11-05',
    dateDisplay: 'Nov 5-8, 2026',
    location: 'Chicago, IL',
    specialty: 'Oncology',
    seatsAvailable: 150,
    totalSeats: 400,
    cmeCredits: 36,
    isOnline: false,
  },
]

export default function ConferencesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    specialty: 'All Specialties',
    location: 'All Locations',
    cmeCredits: 'Any CME Credits',
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredConferences = useMemo(() => {
    return conferenceData.filter((conf) => {
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
          ![
            'Boston, MA',
            'San Diego, CA',
            'Chicago, IL',
            'Toronto, Canada',
          ].some((loc) => conf.location.includes(loc.split(',')[0]))
        )
          return false
        if (
          filters.location === 'Europe' &&
          !['Vienna, Austria', 'Barcelona, Spain'].some((loc) =>
            conf.location.includes(loc.split(',')[0]),
          )
        )
          return false
        if (
          filters.location === 'Asia Pacific' &&
          !conf.location.includes('Singapore')
        )
          return false
      }

      // CME Credits filter
      if (filters.cmeCredits !== 'Any CME Credits') {
        const credits = conf.cmeCredits
        if (
          filters.cmeCredits === '1-10 Credits' &&
          (credits < 1 || credits > 10)
        )
          return false
        if (
          filters.cmeCredits === '11-25 Credits' &&
          (credits < 11 || credits > 25)
        )
          return false
        if (
          filters.cmeCredits === '26-50 Credits' &&
          (credits < 26 || credits > 50)
        )
          return false
        if (filters.cmeCredits === '50+ Credits' && credits <= 50) return false
      }

      return true
    })
  }, [searchQuery, filters])

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
              <span className="font-semibold text-[#0F172A]">MedCon</span>
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
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Filter Bar */}
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#0F172A]/60">
              Showing{' '}
              <span className="font-semibold text-[#0F172A]">
                {filteredConferences.length}
              </span>{' '}
              conferences
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-[#0F172A]/50">
                Live availability
              </span>
            </div>
          </div>

          {/* Conference Grid */}
          <ConferenceGrid conferences={filteredConferences} />
        </div>
      </main>
    </div>
  )
}
