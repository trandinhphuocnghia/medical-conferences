import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

const benefits = [
  'Full access to all keynotes & sessions',
  'Workshop participation included',
  'Networking events & gala dinner',
  'CME credits documentation',
  'Digital conference materials',
]

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight text-balance">
              Secure Your Spot at HIGCF 2026
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 text-pretty">
              Early bird registration ends August 1st. Join thousands of healthcare professionals
              advancing the future of medicine.
            </p>

            {/* Benefits */}
            <ul className="mt-8 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-primary-foreground/90">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-accent-foreground" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-2xl p-8 shadow-xl">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Early Bird Pricing
              </p>
              <div className="mt-4">
                <span className="text-5xl font-bold text-card-foreground">$899</span>
                <span className="text-muted-foreground ml-2">USD</span>
              </div>
              <p className="mt-2 text-sm text-accent font-medium">Save $300 before August 1st</p>
            </div>

            <div className="mt-8 space-y-4">
              <Button
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base font-semibold"
              >
                Register Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-border text-card-foreground hover:bg-secondary py-6 text-base bg-transparent"
              >
                Group Registration (10+)
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Need an invoice for your institution?{' '}
              <a href="#" className="text-accent hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
