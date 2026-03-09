'use client'

import { PresenterData } from '@/app/actions/abstracts/getConferencePresenters'
import { RichTextParser } from '@/components/RichTextParser'
import { Building2, FileText, Star, User } from 'lucide-react'
import NextImage from 'next/image'

interface PresentersSectionProps {
  presenters: PresenterData[]
}

export function PresentersSection({ presenters }: PresentersSectionProps) {
  if (!presenters || presenters.length === 0) return null

  const invitedSpeakers = presenters.filter((p) => p.registrationType === 'invited')
  const generalPresenters = presenters.filter((p) => p.registrationType !== 'invited')

  return (
    <section id="presenters" className="py-16 sm:py-24 bg-slate-50/50 scroll-mt-[132px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4 flex items-center gap-3">
            <Star className="h-8 w-8 text-cyan-500 fill-cyan-500/10" />
            Distinguished Presenters
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Meet the clinical experts and researchers presenting their latest findings at this
            conference.
          </p>
        </div>

        {/* Invited Speakers (VIPs) */}
        {invitedSpeakers.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-navy mb-8 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="h-px bg-cyan-200 flex-1"></span>
              Invited Speakers
              <span className="h-px bg-cyan-200 flex-1"></span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {invitedSpeakers.map((presenter) => (
                <PresenterCard key={presenter.id} presenter={presenter} featured />
              ))}
            </div>
          </div>
        )}

        {/* Accepted Presenters */}
        {generalPresenters.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-navy mb-8 flex items-center gap-2 uppercase tracking-wider text-sm">
              <span className="h-px bg-slate-200 flex-1"></span>
              Presenters & Researchers
              <span className="h-px bg-slate-200 flex-1"></span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {generalPresenters.map((presenter) => (
                <PresenterCard key={presenter.id} presenter={presenter} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function PresenterCard({ presenter, featured }: { presenter: PresenterData; featured?: boolean }) {
  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 ${
        featured
          ? 'bg-white border-cyan-100 shadow-xl shadow-cyan-900/5 hover:border-cyan-200'
          : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`shrink-0 rounded-xl overflow-hidden bg-slate-100 border-2 ${
              featured ? 'border-cyan-50' : 'border-slate-50'
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
                  featured ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <User className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold truncate ${
                featured ? 'text-lg text-navy' : 'text-base text-slate-900'
              }`}
            >
              {presenter.name}
            </h4>
            {presenter.organization && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{presenter.organization}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bio (only for featured) */}
        {featured && presenter.bio && (
          <div className="mb-4 text-sm text-slate-600 line-clamp-3">
            <RichTextParser content={presenter.bio} />
          </div>
        )}

        {/* Abstracts List */}
        <div className="space-y-3 mt-4 pt-4 border-t border-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            Accepted Abstracts ({presenter.abstracts.length})
          </p>
          <div className="space-y-2">
            {presenter.abstracts.map((abs) => (
              <div key={abs.id} className="group/item">
                <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed group-hover/item:text-cyan-600 transition-colors">
                  {abs.title}
                </p>
                {abs.topicName && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-slate-50 text-[10px] text-slate-500 rounded border border-slate-100">
                    {abs.topicName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
