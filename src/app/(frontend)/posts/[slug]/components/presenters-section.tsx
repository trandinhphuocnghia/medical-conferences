'use client'

import { PresenterData } from '@/app/actions/shared/presenterUtils'
import { SpeakerCarousel } from './speaker-carousel'
import { RichTextParser } from '@/components/RichTextParser'
import { Building2, User } from 'lucide-react'
import NextImage from 'next/image'
import { useState } from 'react'
import { PresenterDetailModal } from './presenter-detail-modal'
import { Post } from '@/payload-types'

interface PresentersSectionProps {
  presenters: PresenterData[]
  highlightPresenters?: PresenterData[]
  programs?: Post['program']
}

export function PresentersSection({
  presenters,
  highlightPresenters = [],
}: PresentersSectionProps) {
  const [selectedPresenter, setSelectedPresenter] = useState<PresenterData | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  if ((!presenters || presenters.length === 0) && highlightPresenters.length === 0) return null

  const internationalSpeakers = [
    ...highlightPresenters.filter((p) => p.nationality === 'international'),
    ...presenters.filter((p) => p.nationality === 'international')
  ]
  const vietnameseSpeakers = [
    ...highlightPresenters.filter((p) => p.nationality === 'vietnamese'),
    ...presenters.filter((p) => p.nationality === 'vietnamese')
  ]

  const handlePresenterClick = (presenter: PresenterData) => {
    setSelectedPresenter(presenter)
    setModalOpen(true)
  }

  return (
    <>
      <section id="speakers" className="py-8 sm:py-12 bg-slate-50/50 scroll-mt-[132px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Scientific Program Faculty
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Meet the clinical experts and researchers from across the globe and Vietnam.
            </p>
          </div>

          {/* International Speakers */}
          {internationalSpeakers.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-navy border-b-2 border-accent/20 pb-3 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-accent rounded-full inline-block" />
                International moderators and speakers
              </h3>
              <SpeakerCarousel
                speakers={internationalSpeakers}
                onPresenterClick={handlePresenterClick}
              />
            </div>
          )}

          {/* Vietnamese Speakers & Moderators */}
          {vietnameseSpeakers.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-navy border-b-2 border-accent/20 pb-3 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-accent rounded-full inline-block" />
                Vietnamese moderators and speakers
              </h3>
              <SpeakerCarousel
                speakers={vietnameseSpeakers}
                onPresenterClick={handlePresenterClick}
              />
            </div>
          )}
        </div>
      </section>

      <PresenterDetailModal
        presenter={selectedPresenter}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}

export interface PresenterCardProps {
  presenter: PresenterData
  featured?: boolean
  compact?: boolean
  onClick: () => void
}

export function PresenterCard({
  presenter,
  featured = false,
  compact = false,
  onClick,
}: PresenterCardProps) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group cursor-pointer relative flex flex-col h-full bg-white rounded-xl border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300 overflow-hidden w-[160px] sm:w-[200px] lg:w-[220px]"
      >
        {/* Image Container - Fixed Dimensions to ensure uniformity */}
        <div className="relative w-full h-[200px] sm:h-[260px] lg:h-[280px] bg-slate-100 overflow-hidden shrink-0">
          {presenter.avatarUrl ? (
            <NextImage
              src={presenter.avatarUrl}
              alt={presenter.name}
              fill
              className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground/20">
              <User className="h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info Container - Fixed Height for Uniformity */}
        <div className="p-3 pb-4 flex-1 flex flex-col items-center text-center bg-white min-h-[84px] w-full">
          <h4 className="text-xs sm:text-sm font-bold text-navy leading-tight line-clamp-2 mt-1 break-words w-full px-1">
            {presenter.name}
          </h4>
          {presenter.degrees && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 line-clamp-1 opacity-80 px-1">
              {presenter.degrees}
            </p>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`group relative rounded-2xl border transition-all duration-300 text-left w-full hover:scale-105 active:scale-100 ${featured
        ? 'bg-white border-accent/20 shadow-lg shadow-accent/10 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/15'
        : 'bg-white/60 border-border hover:border-accent/30 hover:shadow-lg hover:bg-white'
        }`}
    >
      <div className="p-5 sm:p-6">
        {/* Avatar Section */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div
            className={`shrink-0 rounded-xl overflow-hidden bg-muted border-2 transition-colors ${featured ? 'border-accent/20 group-hover:border-accent/40' : 'border-border'
              }`}
          >
            {presenter.avatarUrl ? (
              <NextImage
                src={presenter.avatarUrl}
                alt={presenter.name}
                width={64}
                height={64}
                className="h-16 w-16 object-cover"
                unoptimized
              />
            ) : (
              <div
                className={`h-16 w-16 flex items-center justify-center ${featured ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                  }`}
              >
                <User className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold truncate transition-colors ${featured ? 'text-lg text-navy group-hover:text-accent' : 'text-base text-navy'
                }`}
            >
              {presenter.name}
              {presenter.degrees && (
                <span className="ml-1 text-[0.85em] opacity-80 font-normal">
                  , {presenter.degrees}
                </span>
              )}
            </h4>
            {presenter.organization && (
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1 truncate">
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{presenter.organization}</span>
              </p>
            )}
            {presenter.registrationType === 'invited' && (
              <p className="text-xs font-medium text-accent mt-1">Invited Speaker</p>
            )}
          </div>
        </div>

        {/* Bio Preview - Featured Only */}
        {featured && presenter.bio && (
          <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            <RichTextParser content={presenter.bio} />
          </div>
        )}

        {/* Abstracts Count */}
        {presenter.abstracts && presenter.abstracts.length > 0 && (
          <div className="text-xs font-medium text-accent pt-2 border-t border-border">
            {presenter.abstracts.length} presentation{presenter.abstracts.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Click Hint */}
        <div className="mt-3 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Click for details
        </div>
      </div>
    </button>
  )
}
