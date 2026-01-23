import { Post } from '@/payload-types'
import { BentoGrid } from './bento-grid'
import { CTASection } from './cta-section'
import { Footer } from './footer'
import { Header } from './header'
import { HeroSection } from './hero-section'
import { ScheduleSection } from './schedule-section'
import { SpeakersSection } from './speaker-section'

export const Homepage = ({}: { conferences: Post[] }) => (
  <main className="min-h-screen">
    <Header />
    <HeroSection />
    <BentoGrid />
    <SpeakersSection />
    <ScheduleSection />
    <CTASection />
    <Footer />
  </main>
)
