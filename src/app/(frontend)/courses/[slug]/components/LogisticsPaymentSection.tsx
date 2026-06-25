import type { Course } from '@/payload-types'
import { RichTextParser } from '@/components/RichTextParser'

// ── Types ──────────────────────────────────────────────────────────────────────
type LogisticsInfoProps = {
  logistics_info?: Course['logistics_info']
  // Label overrides (English defaults)
  sectionLabel?: string
  certificateCardLabel?: string
  bankTransferCardLabel?: string
  contactCardLabel?: string
}

// ── Sub-component: reusable info card ────────────────────────────────────────
// Each card uses h-full so that all cards in the same grid row share height.
function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 h-full rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Card title */}
      <h3 className="text-h3 text-clinical">{title}</h3>

      {/* Accent divider under the title */}
      <div className="h-px w-10 bg-accent/40" />

      {/* Rich text content — RichTextParser owns all typography */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function LogisticsPaymentSection({
  logistics_info,
  sectionLabel = 'Logistics & Registration Info',
  certificateCardLabel = 'Certificate & Requirements',
  contactCardLabel = 'Contact Information',
}: LogisticsInfoProps) {
  const hasCertificate = !!logistics_info?.certificate_requirements
  const hasContact = !!logistics_info?.contact_info

  // Render nothing when all three fields are empty
  if (!hasCertificate && !hasContact) return null

  return (
    <section
      aria-labelledby="logistics-section-title"
      className="pb-16 md:pb-24 bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">

          {/* Section header */}
          <div>
            <h2 id="logistics-section-title" className="text-h2 text-clinical">
              {sectionLabel}
            </h2>
            <div className="mt-2 h-1 w-12 bg-accent rounded-full" />
          </div>

          {/* Balanced 2-column grid with a centered max-width constraint */}
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

              {/* Card 1: Certificate & Requirements */}
              {hasCertificate && (
                <InfoCard title={certificateCardLabel}>
                  <RichTextParser content={logistics_info!.certificate_requirements} />
                </InfoCard>
              )}

              {/* Card 2: Contact Information */}
              {hasContact && (
                <InfoCard title={contactCardLabel}>
                  <RichTextParser content={logistics_info!.contact_info} />
                </InfoCard>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
