import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,200,200,0.3),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(0,200,200,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium">Registration Now Open</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight text-balance max-w-5xl mx-auto leading-tight">
          Advancing Medicine Through Collaboration
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed text-pretty">
          Join 5,000+ healthcare professionals at the premier international medical conference.
          Discover breakthrough research, connect with global experts, and shape the future of
          healthcare.
        </p>

        {/* Event Details */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-primary-foreground/90">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">September 15-18, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">Boston Convention Center</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold"
          >
            Register Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-base font-semibold bg-transparent"
          >
            View Full Schedule
          </Button>
        </div>
      </div>
    </section>
  )
}
