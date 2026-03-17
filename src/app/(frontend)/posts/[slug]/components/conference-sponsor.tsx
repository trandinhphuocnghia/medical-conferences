'use client'

import { Sponsor } from '@/payload-types'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface SponsorSectionProps {
  sponsors?: Sponsor[]
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const logoUrl = typeof sponsor.logo === 'object' ? sponsor.logo.url : ''
  const levelConfig = {
    diamond: {
      container: 'col-span-1',
      imageSize: 'h-16 sm:h-20',
      padding: 'p-4 sm:p-6',
      border: 'border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5',
      shadow: 'shadow-sm hover:shadow-md shadow-accent/10',
    },
    gold: {
      container: 'col-span-1',
      imageSize: 'h-14 sm:h-16',
      padding: 'p-3 sm:p-4',
      border: 'border-accent/20 bg-accent/5',
      shadow: 'shadow-sm hover:shadow-md',
    },
    silver: {
      container: 'col-span-1',
      imageSize: 'h-12 sm:h-14',
      padding: 'p-2 sm:p-3',
      border: 'border-border bg-card/60',
      shadow: 'hover:shadow-sm',
    },
    bronze: {
      container: 'col-span-1',
      imageSize: 'h-10 sm:h-12',
      padding: 'p-2',
      border: 'border-border/60 bg-card/40',
      shadow: 'hover:opacity-80',
    },
  }

  const config = levelConfig[sponsor.level]

  return (
    <a
      href={sponsor?.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${config.border} ${config.shadow}`}
    >
      <div
        className={`flex items-center justify-center ${config.padding} gap-4 sm:gap-6 ${sponsor.level === 'diamond' || sponsor.level === 'gold' ? 'flex-col text-center' : 'flex-col'}`}
      >
        {logoUrl ? (
          <div className={`relative ${config.imageSize} w-full max-w-xs flex-shrink-0`}>
            <Image
              src={logoUrl}
              alt={sponsor.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        ) : (
          <div
            className={`${config.imageSize} w-full max-w-xs bg-muted rounded-lg flex items-center justify-center text-muted-foreground`}
          >
            <span className="text-xs sm:text-sm font-medium">Logo</span>
          </div>
        )}

        {(sponsor.level === 'diamond' || sponsor.level === 'gold') && (
          <div className="flex-1 flex flex-col items-center justify-center">
            {sponsor.url && (
              <div className="mt-2 flex items-center gap-1 text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-3 w-3" />
                Visit
              </div>
            )}
          </div>
        )}
      </div>

      {(sponsor.level === 'silver' || sponsor.level === 'bronze') && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors duration-300 rounded-xl">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-1.5">
            {sponsor.url && (
              <div className="flex items-center gap-1 text-accent text-[10px] sm:text-xs font-medium">
                <ExternalLink className="h-3 w-3" />
                Visit
              </div>
            )}
          </div>
        </div>
      )}
    </a>
  )
}

export function SponsorSection({ sponsors = [] }: SponsorSectionProps) {
  if (!sponsors || sponsors.length === 0) {
    return null
  }

  const diamondSponsors = sponsors.filter((s) => s.level === 'diamond')
  const goldSponsors = sponsors.filter((s) => s.level === 'gold')
  const silverSponsors = sponsors.filter((s) => s.level === 'silver')
  const bronzeSponsors = sponsors.filter((s) => s.level === 'bronze')

  return (
    <section id="sponsors" className="py-8 sm:py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-navy mb-2 mt-2">Sponsors</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            We gratefully acknowledge our sponsors whose support makes this conference possible
          </p>
        </div>

        {/* Diamond Sponsors */}
        {diamondSponsors.length > 0 && (
          <div className="mb-12 sm:mb-14">
            <h3 className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
              Diamond
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {diamondSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        {/* Gold Sponsors */}
        {goldSponsors.length > 0 && (
          <div className="mb-12 sm:mb-14">
            <h3 className="text-xs sm:text-sm font-semibold text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></span>
              Gold
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {goldSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        {/* Silver Sponsors */}
        {silverSponsors.length > 0 && (
          <div className="mb-12 sm:mb-14">
            <h3 className="text-xs sm:text-sm font-semibold text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Silver
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
              {silverSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        {/* Bronze Sponsors */}
        {bronzeSponsors.length > 0 && (
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-900"></span>
              Bronze
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
              {bronzeSponsors.map((sponsor) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
