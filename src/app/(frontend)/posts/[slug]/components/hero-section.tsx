import React from 'react'
import type { PresenterData } from '@/app/actions/shared/presenterUtils'
import { ScientificBoard } from './scientific-board'
import { TypewriterTitle } from './typewriter-title'
import Image from 'next/image'

interface HeroSectionProps {
  presenters?: PresenterData[]
}

const RoboticPosterSection = ({ presenters = [] }: HeroSectionProps) => {
  return (
    <section className="relative mt-6 lg:mt-10 min-h-screen w-full overflow-hidden bg-[#010816] flex flex-col">

      {/* ── Hospital Logo Placeholder (top-left, glass effect) ── */}
      <div className="absolute top-6 left-6 z-50">
        <div className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center px-4 py-2 shadow-lg">
          <Image
            alt='benhviendaihocyduoc-logo'
            width={400}
            height={100}
            src={'/assets/img/benhviendaihocyduoc.webp'}
            className="w-40 h-auto sm:w-56 lg:w-72 object-contain"
            priority
          />
        </div>
      </div>

      {/* ── Main content area (robot + text) ── */}
      <div className="relative flex-1 flex flex-col lg:flex-row min-h-0">

        {/* Robot Visual Layer */}
        <div className="relative h-[50vh] w-full lg:absolute lg:inset-0 lg:h-full z-10">
          <div className="container mx-auto h-full relative">
            {/* Stomach glow */}
            <div className="absolute left-1/2 top-1/2 lg:left-[20%] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 lg:h-96 lg:w-96 stomach-glow animate-pulse" />

            {/* Robot image */}
            <div
              className="absolute inset-0 bg-contain bg-no-repeat lg:opacity-40 bg-center lg:bg-left-center
                mask-mobile lg:mask-desktop transition-all duration-1000 transform hover:scale-105"
              style={{
                backgroundImage: `url('/assets/img/robot 3.png')`,
                filter: 'brightness(1.1) contrast(1.05)',
              }}
            />
          </div>
        </div>

        {/* Overlay gradients */}
        <div className="absolute bottom-0 left-0 z-20 h-32 w-full bg-gradient-to-t from-[#010816] to-transparent lg:hidden" />
        <div className="absolute inset-0 z-15 bg-gradient-to-b from-[#010816]/20 via-transparent to-[#010816] lg:bg-gradient-to-r lg:from-transparent lg:to-[#010816]/80" />

        {/* Content Layer */}
        <div className="relative z-30 flex flex-col justify-center px-6 pb-16 pt-10 lg:container lg:mx-auto lg:h-full lg:flex-row lg:items-center lg:justify-end lg:pb-0 lg:pt-0">
          <div className="w-full lg:max-w-[800px] text-center lg:text-left">
            {/* Main Headline (Typing Effect) */}
            <TypewriterTitle />

            {/* Info Block */}
            <div className="space-y-3 lg:border-l-2 lg:border-cyan/30 lg:pl-10">
              <h2 className="text-xl font-bold text-white/90 sm:text-2xl">
                Pre-congress
              </h2>

              {/* Date & Venue */}
              <div className="flex justify-center lg:justify-start gap-8 sm:gap-12 pb-2">
                <div className="text-center lg:text-left shrink-0">
                  <p className="text-[10px] text-cyan font-bold uppercase tracking-widest mb-1">
                    Time
                  </p>
                  <p className="text-lg text-white font-mono break-words">14.05.2026</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-[10px] text-cyan font-bold uppercase tracking-widest mb-1">
                    Venue
                  </p>
                  <p className="text-lg text-white uppercase tracking-tight break-words max-w-sm lg:max-w-full">
                    Auditorium 3A, Floor 3, University Medical Center HCMC
                  </p>
                </div>
              </div>

              {/**SCIENTIFIC BOARD */}
              <div className="w-full -mx-4 sm:mx-0 pt-4">
                <ScientificBoard presenters={presenters} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/**PROGRAM */}
      <div className="relative z-40 w-full border-t border-cyan/10 bg-gradient-to-t from-[#010816] via-[#010816]/95 to-transparent pt-6 pb-12 sm:pt-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-3 w-full max-w-lg mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
            <span className="text-[9px] sm:text-[10px] font-black tracking-[0.35em] uppercase text-cyan/60 whitespace-nowrap">
              Program Details
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
          </div>

          <ul className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 text-slate-300 text-sm leading-relaxed lg:text-base text-left">
            <li className="flex flex-col bg-white/5 p-4 rounded-lg border border-cyan/10 hover:border-cyan/30 transition-colors">
              <span className="font-semibold text-white mb-1">ESD for Early Gastric Cancer</span>
              <span className="text-cyan text-xs uppercase tracking-wider font-medium">Dr. Le Quang Nhan</span>
            </li>

            <li className="flex flex-col bg-white/5 p-4 rounded-lg border border-cyan/10 hover:border-cyan/30 transition-colors">
              <span className="font-semibold text-white mb-1">Laparoscopic Proximal Gastrectomy</span>
              <span className="text-cyan text-xs uppercase tracking-wider font-medium">Dr. Vo Duy Long</span>
            </li>

            <li className="md:col-span-2 bg-gradient-to-r from-cyan/10 to-transparent border-l-2 border-cyan/50 p-4 rounded-r-lg text-xs text-slate-300 italic flex flex-col justify-center">
              <span className="block font-medium text-white not-italic text-sm">Broadcast from FV Hospital</span>
              <span className="mt-1">Organized by University Medical Center HCMC & FV Hospital</span>
            </li>

            <li className="flex flex-col bg-white/5 p-4 rounded-lg border border-cyan/10 hover:border-cyan/30 transition-colors">
              <span className="font-semibold text-white mb-1">Robotic Total Gastrectomy</span>
              <span className="text-cyan text-xs uppercase tracking-wider font-medium">Proctor: Prof. Ichiro Uyama</span>
            </li>

            <li className="flex flex-col bg-white/5 p-4 rounded-lg border border-cyan/10 hover:border-cyan/30 transition-colors">
              <span className="font-semibold text-white mb-1">Robotic Distal Gastrectomy</span>
              <span className="text-cyan text-xs uppercase tracking-wider font-medium">Proctor: Prof. Koichi Suda</span>
            </li>

            <li className="flex flex-col bg-white/5 p-4 rounded-lg border border-cyan/10 hover:border-cyan/30 transition-colors md:col-span-2 lg:col-span-1">
              <span className="font-semibold text-white mb-1">Laparoscopic Distal Gastrectomy</span>
              <span className="text-cyan text-xs uppercase tracking-wider font-medium">Proctor: Prof. Noriyuki Inaki</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default RoboticPosterSection