import { Post } from '@/payload-types'
import { BentoGrid } from './bento-grid'
import { CTASection } from './cta-section'
import { HeroSection } from './hero-section'
import { ScheduleSection } from './schedule-section'
import { SpeakersSection } from './speaker-section'

export const Homepage = ({}: { conferences: Post[] }) => (
  <main className="min-h-screen">
    <HeroSection />
    <BentoGrid />
    <SpeakersSection />
    <ScheduleSection />
    <CTASection />
  </main>
)
