import { Post } from '@/payload-types'
import { BentoGrid } from './bento-grid'
import { HeroSection } from './hero-section'
import { ScheduleSection } from './schedule-section'
import { SpeakersSection } from './speaker-section'

type HomepageProps = {
  conferences: Post[]
  currentConference: Post | null
}

export const Homepage = ({ currentConference }: HomepageProps) => (
  <main className="min-h-screen">
    <HeroSection conference={currentConference} />
    <BentoGrid />
    <SpeakersSection />
    <ScheduleSection />
  </main>
)
