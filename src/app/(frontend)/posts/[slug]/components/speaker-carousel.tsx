'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PresenterCard } from './presenters-section'
import { PresenterData } from '@/app/actions/shared/presenterUtils'

interface SpeakerCarouselProps {
  speakers: PresenterData[]
  onPresenterClick: (presenter: PresenterData) => void
}

export function SpeakerCarousel({ speakers, onPresenterClick }: SpeakerCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      checkScroll()
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll)
      }
      window.removeEventListener('resize', checkScroll)
    }
  }, [speakers])

  // Autoplay Logic
  useEffect(() => {
    if (isPaused || speakers.length < 2) return

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10

        if (isAtEnd) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scroll('right')
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, speakers.length])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current
      const scrollAmount = clientWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div
      className="relative group/carousel h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none z-10 flex justify-between px-2 sm:-mx-4">
        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 sm:h-10 sm:w-10 bg-white shadow-md rounded-full pointer-events-auto transition-all ${canScrollLeft ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            } sm:group-hover/carousel:opacity-100 sm:opacity-0`}
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 sm:h-10 sm:w-10 bg-white shadow-md rounded-full pointer-events-auto transition-all ${canScrollRight ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            } sm:group-hover/carousel:opacity-100 sm:opacity-0`}
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {speakers.map((presenter) => (
          <div
            key={presenter.id}
            className="flex-none w-[160px] sm:w-[200px] lg:w-[220px] h-full snap-start"
          >
            <PresenterCard
              presenter={presenter}
              compact
              onClick={() => onPresenterClick(presenter)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
