'use client'

import React from 'react'

import {
  Award,
  ChevronDown,
  Filter,
  MapPin,
  Stethoscope,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface FilterBarProps {
  filters: {
    specialty: string
    location: string
    cmeCredits: string
  }
  onFilterChange: (key: string, value: string) => void
}

const specialties = [
  'All Specialties',
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
  'Pediatrics',
  'Surgery',
  'Radiology',
  'Dermatology',
]

const locations = [
  'All Locations',
  'Global',
  'Online',
  'North America',
  'Europe',
  'Asia Pacific',
  'Middle East',
]

const cmeOptions = [
  'Any CME Credits',
  '1-10 Credits',
  '11-25 Credits',
  '26-50 Credits',
  '50+ Credits',
]

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const hasActiveFilters =
    filters.specialty !== 'All Specialties' ||
    filters.location !== 'All Locations' ||
    filters.cmeCredits !== 'Any CME Credits'

  const clearFilters = () => {
    onFilterChange('specialty', 'All Specialties')
    onFilterChange('location', 'All Locations')
    onFilterChange('cmeCredits', 'Any CME Credits')
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white/70 backdrop-blur-xl p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-2 text-[#0F172A]/60">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-1">
          {/* Specialty Filter */}
          <FilterDropdown
            icon={<Stethoscope className="h-4 w-4" />}
            label="Specialty"
            value={filters.specialty}
            options={specialties}
            isOpen={openDropdown === 'specialty'}
            onToggle={() =>
              setOpenDropdown(openDropdown === 'specialty' ? null : 'specialty')
            }
            onChange={(value) => {
              onFilterChange('specialty', value)
              setOpenDropdown(null)
            }}
          />

          {/* Location Filter */}
          <FilterDropdown
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={filters.location}
            options={locations}
            isOpen={openDropdown === 'location'}
            onToggle={() =>
              setOpenDropdown(openDropdown === 'location' ? null : 'location')
            }
            onChange={(value) => {
              onFilterChange('location', value)
              setOpenDropdown(null)
            }}
          />

          {/* CME Credits Filter */}
          <FilterDropdown
            icon={<Award className="h-4 w-4" />}
            label="CME Credits"
            value={filters.cmeCredits}
            options={cmeOptions}
            isOpen={openDropdown === 'cmeCredits'}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === 'cmeCredits' ? null : 'cmeCredits',
              )
            }
            onChange={(value) => {
              onFilterChange('cmeCredits', value)
              setOpenDropdown(null)
            }}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-[#0F172A]/60 hover:text-[#06B6D4] transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}

interface FilterDropdownProps {
  icon: React.ReactNode
  label: string
  value: string
  options: string[]
  isOpen: boolean
  onToggle: () => void
  onChange: (value: string) => void
}

function FilterDropdown({
  icon,
  label,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
}: FilterDropdownProps) {
  const isDefault = value === options[0]

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all
          ${
            isDefault
              ? 'border-[#E2E8F0] bg-white text-[#0F172A]/70 hover:border-[#06B6D4]/50'
              : 'border-[#06B6D4] bg-[#06B6D4]/5 text-[#06B6D4]'
          }
        `}
      >
        {icon}
        <span className="hidden sm:inline">{label}:</span>
        <span className="font-medium">{value}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-99999" onClick={onToggle} />
          <div className="absolute top-full left-0 mt-2 z-999999 min-w-[200px] rounded-xl border border-[#E2E8F0] bg-white shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm transition-colors
                  ${
                    option === value
                      ? 'bg-[#06B6D4]/10 text-[#06B6D4] font-medium'
                      : 'text-[#0F172A]/70 hover:bg-[#F8FAFC]'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
