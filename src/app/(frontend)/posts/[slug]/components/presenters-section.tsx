'use client'

import { PresenterData } from '@/app/actions/abstracts/getConferencePresenters'
import { RichTextParser } from '@/components/RichTextParser'
import { Post } from '@/payload-types'
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

  const keynoteSpeakers = highlightPresenters
  const invitedSpeakers = presenters.filter((p) => p.registrationType === 'invited')
  const generalPresenters = presenters.filter((p) => p.registrationType !== 'invited')

  const handlePresenterClick = (presenter: PresenterData) => {
    setSelectedPresenter(presenter)
    setModalOpen(true)
  }

  return (
    <>
      <section id="speakers" className="py-8 sm:py-12 bg-slate-50/50 scroll-mt-[132px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Featured & Distinguished Speakers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Meet the clinical experts and researchers presenting their latest findings at this
              conference.
            </p>
          </div>

          {/* Keynote & Highlight Speakers */}
          {keynoteSpeakers.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {keynoteSpeakers.map((presenter) => (
                  <PresenterCard
                    key={presenter.id}
                    presenter={presenter}
                    compact
                    onClick={() => handlePresenterClick(presenter)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Invited Speakers */}
          {invitedSpeakers.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
                {invitedSpeakers.map((presenter) => (
                  <PresenterCard
                    key={presenter.id}
                    presenter={presenter}
                    compact
                    onClick={() => handlePresenterClick(presenter)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Accepted Presenters */}
          {generalPresenters.length > 0 && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
                {generalPresenters.map((presenter) => (
                  <PresenterCard
                    key={presenter.id}
                    presenter={presenter}
                    compact
                    onClick={() => handlePresenterClick(presenter)}
                  />
                ))}
              </div>
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

interface PresenterCardProps {
  presenter: PresenterData
  featured?: boolean
  compact?: boolean
  onClick: () => void
}

function PresenterCard({
  presenter,
  featured = false,
  compact = false,
  onClick,
}: PresenterCardProps) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group cursor-pointer relative flex flex-col transition-all duration-300 overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative rounded-t-lg overflow-hidden aspect-[3/4] group-hover:shadow-md transition-shadow bg-slate-100">
          {presenter.avatarUrl ? (
            <div className="h-full w-full">
              <NextImage
                src={presenter.avatarUrl}
                alt={presenter.name}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-full w-full bg-slate-50 flex items-center justify-center text-muted-foreground/30">
              <User className="h-24 w-24" />
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="p-1 flex-1 flex flex-col justify-start text-left">
          <h4 className="text-sm sm:text-base font-bold text-navy leading-tight group-hover:text-accent transition-colors mb-1.5">
            {presenter.name}
          </h4>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`group relative rounded-2xl border transition-all duration-300 text-left w-full hover:scale-105 active:scale-100 ${
        featured
          ? 'bg-white border-accent/20 shadow-lg shadow-accent/10 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/15'
          : 'bg-white/60 border-border hover:border-accent/30 hover:shadow-lg hover:bg-white'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Avatar Section */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div
            className={`shrink-0 rounded-xl overflow-hidden bg-muted border-2 transition-colors ${
              featured ? 'border-accent/20 group-hover:border-accent/40' : 'border-border'
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
                className={`h-16 w-16 flex items-center justify-center ${
                  featured ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                }`}
              >
                <User className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold truncate transition-colors ${
                featured ? 'text-lg text-navy group-hover:text-accent' : 'text-base text-navy'
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
