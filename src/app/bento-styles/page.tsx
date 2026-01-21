import { BentoGrid } from './components/bento-grid'
import { CTASection } from './components/cta-section'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { HeroSection } from './components/hero-section'
import { ScheduleSection } from './components/schedule-section'
import { SpeakersSection } from './components/speaker-section'

export default function LandingPage() {
  return (
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
}
