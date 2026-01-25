import { Button } from '@/components/ui/button'
import { ArrowRight, Award, BookOpen, FlaskConical, Globe, Mic2 } from 'lucide-react'
import React from 'react'

interface BentoCardProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
  stat?: string
  statLabel?: string
  variant?: 'default' | 'accent' | 'dark'
}

function BentoCard({
  title,
  description,
  icon,
  className,
  stat,
  statLabel,
  variant = 'default',
}: BentoCardProps) {
  const variantStyles = {
    default: 'bg-card border border-border',
    accent: 'bg-accent text-accent-foreground',
    dark: 'bg-primary text-primary-foreground',
  }

  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between ${variantStyles[variant]} ${className}`}
    >
      <div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
            variant === 'default' ? 'bg-secondary' : 'bg-white/10'
          }`}
        >
          {icon}
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            variant === 'default' ? 'text-card-foreground' : ''
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          }`}
        >
          {description}
        </p>
      </div>
      {stat && (
        <div className="mt-6 pt-6 border-t border-current/10">
          <span className="text-3xl sm:text-4xl font-bold">{stat}</span>
          <span
            className={`block text-sm mt-1 ${
              variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
            }`}
          >
            {statLabel}
          </span>
        </div>
      )}
    </div>
  )
}

export function BentoGrid() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Why Attend MedCon 2026
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Four days of cutting-edge medical research, networking opportunities, and hands-on
            workshops designed for healthcare professionals.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Large Featured Card */}
          <BentoCard
            className="lg:col-span-2 lg:row-span-1"
            title="World-Class Keynote Speakers"
            description="Learn from Nobel laureates, leading researchers, and pioneering clinicians who are shaping the future of medicine. Our carefully curated lineup represents the best minds in healthcare."
            icon={<Mic2 className="w-6 h-6 text-accent" />}
            stat="50+"
            statLabel="Distinguished speakers from 30 countries"
            variant="dark"
          />

          {/* Stats Card */}
          <BentoCard
            title="Global Attendees"
            description="Connect with healthcare professionals from around the world. Build lasting relationships and expand your professional network."
            icon={<Globe className="w-6 h-6 text-accent" />}
            stat="5,000+"
            statLabel="Expected attendees"
            variant="accent"
          />

          {/* Research Card */}
          <BentoCard
            title="Research Presentations"
            description="Access over 300 peer-reviewed research presentations covering the latest advancements in oncology, cardiology, neurology, and more."
            icon={<FlaskConical className="w-6 h-6 text-accent" />}
            stat="300+"
            statLabel="Research papers"
          />

          {/* Workshops Card */}
          <BentoCard
            title="Hands-On Workshops"
            description="Participate in interactive workshops led by industry experts. Gain practical skills in new surgical techniques, diagnostic tools, and treatment protocols."
            icon={<BookOpen className="w-6 h-6 text-accent" />}
            stat="40+"
            statLabel="Workshop sessions"
          />

          {/* CME Credits Card */}
          <BentoCard
            title="CME Credits"
            description="Earn up to 32 AMA PRA Category 1 Credits and maintain your professional certifications while learning from the best."
            icon={<Award className="w-6 h-6 text-accent" />}
            stat="32"
            statLabel="CME credits available"
          />
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Explore Full Program
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
