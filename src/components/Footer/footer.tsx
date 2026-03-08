import { Mail, MapPin, Phone, Stethoscope } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  Conference: [
    { label: 'About', href: '#about' },
    { label: 'Speakers', href: '#speakers' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Venue', href: '#venue' },
  ],
  Resources: [
    { label: 'FAQs', href: '#' },
    { label: 'Travel Info', href: '#' },
    { label: 'Accommodations', href: '#' },
    { label: 'Past Events', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
}

export const FooterClient = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-semibold text-lg">HIGCF 2026</span>
            </Link>
            <p className="mt-4 text-background/70 text-sm max-w-sm leading-relaxed">
              The premier international medical conference bringing together
              healthcare professionals to advance medicine through
              collaboration.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="w-4 h-4" />
                <span>-</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="w-4 h-4" />
                <span>-</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="w-4 h-4" />
                <span>-</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm uppercase tracking-wide mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            2026 HIGCF. All rights reserved.
          </p>
          <p className="text-sm text-background/50">
            Organized by International Medical Conference Association
          </p>
        </div>
      </div>
    </footer>
  )
}
