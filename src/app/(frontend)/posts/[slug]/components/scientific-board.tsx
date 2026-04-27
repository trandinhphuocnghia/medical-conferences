'use client'

import type { PresenterData } from '@/app/actions/shared/presenterUtils'
import NextImage from 'next/image'
import { useCallback, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'


interface ScientificBoardProps {
  presenters: PresenterData[]
}

function HexAvatar({
  presenter,
  onHover,
  onLeave,
  hexRef,
}: {
  presenter: PresenterData
  onHover: (presenter: PresenterData, el: HTMLDivElement) => void
  onLeave: () => void
  hexRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={hexRef}
      className="group/hex relative flex flex-col items-center gap-2 shrink-0 cursor-pointer"
      onMouseEnter={(e) => onHover(presenter, e.currentTarget)}
      onMouseLeave={onLeave}
    >
      {/* Hex container with border */}
      <div className="relative w-20 h-[92px] sm:w-24 sm:h-[110px] transition-all duration-300">
        {/* Outer hex border */}
        <div
          className="absolute inset-0 hex-clip transition-all duration-300
            bg-cyan/20 group-hover/hex:bg-cyan/60 group-hover/hex:drop-shadow-[0_0_12px_oklch(0.65_0.18_195/0.5)]"
        />
        {/* Inner hex image */}
        <div className="absolute inset-[2px] hex-clip overflow-hidden bg-[#010816]">
          {presenter.avatarUrl ? (
            <NextImage
              src={presenter.avatarUrl}
              alt={presenter.name}
              fill
              className="object-cover transition-all duration-500
                 opacity-70
               group-hover/hex:opacity-100"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyan/40 group-hover/hex:text-cyan/80 transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Name below hex (visible on mobile for tapping context) */}
      <p className="text-[10px] text-slate-500 text-center leading-tight max-w-[80px] sm:max-w-[96px] truncate lg:hidden">
        {presenter.name}
      </p>
    </div>
  )
}


function SpotlightTooltip({
  presenter,
  position,
}: {
  presenter: PresenterData | null
  position: { x: number; y: number } | null
}) {
  if (!presenter || !position) return null

  return (
    <div
      className="fixed z-[100] pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-[#0a1628]/95 backdrop-blur-md border border-cyan/20 rounded-lg px-4 py-3 shadow-2xl shadow-cyan/10 min-w-[180px]">
        <p className="text-white font-bold text-sm leading-tight">{presenter.name}</p>
        {presenter.degrees && (
          <p className="text-cyan text-[10px] font-bold uppercase tracking-widest mt-1">
            {presenter.degrees}
          </p>
        )}
        {presenter.organization && (
          <p className="text-slate-400 text-xs mt-1 leading-snug">{presenter.organization}</p>
        )}
        {/* Tooltip arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-[#0a1628]/95 border-r border-b border-cyan/20 rotate-45" />
      </div>
    </div>
  )
}


function LaserLine({
  from,
  to,
}: {
  from: { x: number; y: number } | null
  to: { x: number; y: number }
}) {
  if (!from) return null

  return (
    <svg
      className="fixed inset-0 z-[90] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        className="laser-dash"
        stroke="oklch(0.65 0.18 195 / 0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Glow circle at hex end */}
      <circle cx={from.x} cy={from.y} r="3" fill="oklch(0.65 0.18 195 / 0.8)">
        <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}


function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      <span className="text-[9px] sm:text-[10px] font-black tracking-[0.35em] uppercase text-cyan/60 whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */

export function ScientificBoard({ presenters }: ScientificBoardProps) {
  const [hoveredPresenter, setHoveredPresenter] = useState<PresenterData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [laserFrom, setLaserFrom] = useState<{ x: number; y: number } | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const internationalPresenters = presenters.filter((p) => p.nationality === 'international')
  const vietnamesePresenters = presenters.filter((p) => p.nationality === 'vietnamese')

  // Dynamically target the stomach glow based on breakpoint (mobile vs desktop)
  const laserTarget =
    typeof window !== 'undefined'
      ? {
        // lg breakpoint is 1024px. Robot is centered on mobile, 20% from left on desktop.
        x: window.innerWidth < 1024 ? window.innerWidth * 0.5 : window.innerWidth * 0.2,
        // Robot takes top 50vh on mobile (so center is ~30vh). On desktop it's vertically centered.
        y: window.innerWidth < 1024 ? window.innerHeight * 0.3 : window.innerHeight * 0.5,
      }
      : { x: 300, y: 300 }

  const handleHover = useCallback((presenter: PresenterData, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect()
    setHoveredPresenter(presenter)
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 })
    setLaserFrom({ x: rect.left + rect.width / 2, y: rect.top })
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredPresenter(null)
    setTooltipPos(null)
    setLaserFrom(null)
  }, [])

  if (presenters.length === 0) return null

  // Calculate marquee duration based on number of items (more items = longer scroll)
  const marqueeDuration = Math.max(20, vietnamesePresenters.length * 4)

  return (
    <>
      <LaserLine from={laserFrom} to={laserTarget} />
      <SpotlightTooltip presenter={hoveredPresenter} position={tooltipPos} />

      <div
        ref={boardRef}
        className={cn(
          "relative z-40 w-full pb-4  to-transparent ",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* International Faculty */}
          {internationalPresenters.length > 0 && (
            <div className="mb-6">
              <SectionLabel label="INTERNATIONAL PROCTORS" />

              {/* Desktop View */}
              <div
                className="hidden lg:block overflow-hidden group"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                }}
              >
                <div
                  className={cn(
                    "flex items-center gap-6",
                    internationalPresenters.length > 5 ? "animate-marquee" : "justify-center"
                  )}
                  style={
                    internationalPresenters.length > 5
                      ? ({ '--marquee-duration': `${Math.max(20, internationalPresenters.length * 4)}s` } as React.CSSProperties)
                      : undefined
                  }
                >
                  {/* Original + duplicate ONLY if scrolling */}
                  {(internationalPresenters.length > 5
                    ? [...internationalPresenters, ...internationalPresenters]
                    : internationalPresenters
                  ).map((presenter, i) => (
                    <HexAvatar
                      key={`${presenter.id}-${i}`}
                      presenter={presenter}
                      onHover={handleHover}
                      onLeave={handleLeave}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile View */}
              <div className={cn(
                "lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2",
                internationalPresenters.length <= 5 && "flex justify-center"
              )}>
                <div className="flex items-center gap-4 w-max px-4">
                  {internationalPresenters.map((presenter) => (
                    <div key={presenter.id} className="snap-center">
                      <HexAvatar
                        presenter={presenter}
                        onHover={handleHover}
                        onLeave={handleLeave}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vietnamese Faculty */}
          {vietnamesePresenters.length > 0 && (
            <div>
              <SectionLabel label="VIETNAMESE FACULTY" />

              {/* Desktop View */}
              <div
                className="hidden lg:block overflow-hidden group"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                }}
              >
                <div
                  className={cn(
                    "flex items-center gap-6",
                    vietnamesePresenters.length > 5 ? "animate-marquee" : "justify-center"
                  )}
                  style={
                    vietnamesePresenters.length > 5
                      ? ({ '--marquee-duration': `${Math.max(20, vietnamesePresenters.length * 4)}s` } as React.CSSProperties)
                      : undefined
                  }
                >
                  {/* Original + duplicate ONLY if scrolling */}
                  {(vietnamesePresenters.length > 5
                    ? [...vietnamesePresenters, ...vietnamesePresenters]
                    : vietnamesePresenters
                  ).map((presenter, i) => (
                    <HexAvatar
                      key={`${presenter.id}-${i}`}
                      presenter={presenter}
                      onHover={handleHover}
                      onLeave={handleLeave}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile View */}
              <div className={cn(
                "lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2",
                vietnamesePresenters.length <= 5 && "flex justify-center"
              )}>
                <div className="flex items-center gap-4 w-max px-4">
                  {vietnamesePresenters.map((presenter) => (
                    <div key={presenter.id} className="snap-center">
                      <HexAvatar
                        presenter={presenter}
                        onHover={handleHover}
                        onLeave={handleLeave}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
