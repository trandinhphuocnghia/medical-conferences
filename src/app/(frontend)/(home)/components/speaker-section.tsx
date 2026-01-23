import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface Speaker {
  name: string
  role: string
  institution: string
  specialty: string
  initials: string
}

const speakers: Speaker[] = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Keynote Speaker',
    institution: 'Harvard Medical School',
    specialty: 'Oncology Research',
    initials: 'SC',
  },
  {
    name: 'Prof. James Mueller',
    role: 'Plenary Speaker',
    institution: 'Mayo Clinic',
    specialty: 'Cardiovascular Surgery',
    initials: 'JM',
  },
  {
    name: 'Dr. Aisha Patel',
    role: 'Workshop Leader',
    institution: 'Johns Hopkins University',
    specialty: 'Neuroscience',
    initials: 'AP',
  },
  {
    name: 'Dr. Michael Okonkwo',
    role: 'Keynote Speaker',
    institution: 'Stanford Medicine',
    specialty: 'Immunotherapy',
    initials: 'MO',
  },
]

export function SpeakersSection() {
  return (
    <section id="speakers" className="py-20 sm:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Featured Speakers
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl text-pretty">
              Learn from world-renowned experts who are pioneering breakthroughs
              in medical research and clinical practice.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted w-fit bg-transparent"
          >
            View All Speakers
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakers.map((speaker) => (
            <div
              key={speaker.name}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-accent/50 transition-colors"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-foreground">
                  {speaker.initials}
                </span>
              </div>

              {/* Info */}
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                {speaker.role}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-accent transition-colors">
                {speaker.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {speaker.institution}
              </p>
              <p className="text-sm text-accent font-medium mt-2">
                {speaker.specialty}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
