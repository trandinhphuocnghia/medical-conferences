'use client'
import Image from 'next/image'

const SPONSORS = [
  {
    id: 0,
    alt: 'Sponsor Logo 1',
    src: '',
  },
  {
    id: 1,
    alt: 'Sponsor Logo 2',
    src: '',
  },
  {
    id: 2,
    alt: 'Sponsor Logo 3',
    src: '',
  },
  {
    id: 3,
    alt: 'Sponsor Logo 4',
    src: '',
  },
  {
    id: 4,
    alt: 'Sponsor Logo 5',
    src: '',
  },
] as const

export const Sponsors = () => (
  <section
    className="w-full bg-white dark:bg-slate-900 py-10 sm:py-16"
    id="sponsors"
  >
    <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 lg:px-4 items-center">
      <h2 className="text-slate-900 dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-8">
        Our Sponsors
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-6 w-full items-center">
        {SPONSORS.map((sponsor) => (
          <div key={sponsor.id} className="relative mx-auto">
            <Image
              src={sponsor.src}
              alt={sponsor.alt}
              width={160}
              height={40}
              className="h-10 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
)
