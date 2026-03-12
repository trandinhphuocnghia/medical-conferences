'use client'

import {
  createRegistrationPublic,
  type PublicRegistrationData,
} from '@/app/actions/registrations/createRegistrationPublic'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'
import { z } from 'zod'

// ── Zod schemas per step ──────────────────────────────────────────────────
const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  email: z.string().email('Enter a valid email address'),
  organization: z.string().max(200, 'Organization must be at most 200 characters').optional(),
})

const feeStepSchema = z.object({
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
})

// ── Types ─────────────────────────────────────────────────────────────────
type Conference = { id: number; title: string }

type FormState = {
  conferenceId: number | null
  fullName: string
  email: string
  organization: string
  joinTheGala: boolean
  notes: string
}

const TOTAL_STEPS = 5
const STEPS = [
  'Select Conference',
  'Personal Information',
  'Registration Fee',
  'Vietnam CME',
  'Review & Register',
]

// ── Main Component ────────────────────────────────────────────────────────
export function RegistrationForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormState>({
    conferenceId: null,
    fullName: '',
    email: '',
    organization: '',
    joinTheGala: false,
    notes: '',
  })

  const [vietnamParticipant, setVietnamParticipant] = useState<boolean | null>(null)

  const [conferences, setConferences] = useState<Conference[]>([])
  const [loadingConferences, setLoadingConferences] = useState(true)

  // Pre-select conference from query param
  useEffect(() => {
    const confId = searchParams.get('conference')
    if (confId) {
      setForm((prev) => ({ ...prev, conferenceId: Number(confId) }))
      setStep(2) // skip to personal info
    }
  }, [searchParams])

  // Fetch active conferences
  useEffect(() => {
    fetch('/api/posts?where[active][equals]=true&limit=50&depth=0')
      .then((r) => r.json())
      .then((d) => setConferences(d?.docs ?? []))
      .catch(() => setConferences([]))
      .finally(() => setLoadingConferences(false))
  }, [])

  const set = (key: keyof FormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setValidationErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validateStep = (currentStep: number): boolean => {
    setValidationErrors({})
    if (currentStep === 2) {
      const result = personalInfoSchema.safeParse({
        fullName: form.fullName,
        email: form.email,
        organization: form.organization || undefined,
      })
      if (!result.success) {
        const errs: Record<string, string> = {}
        result.error.issues.forEach((i) => {
          errs[String(i.path[0])] = i.message
        })
        setValidationErrors(errs)
        return false
      }
    }
    if (currentStep === 3) {
      const result = feeStepSchema.safeParse({
        notes: form.notes || undefined,
      })
      if (!result.success) {
        const errs: Record<string, string> = {}
        result.error.issues.forEach((i) => {
          errs[String(i.path[0])] = i.message
        })
        setValidationErrors(errs)
        return false
      }
    }
    return true
  }

  const canProceedStep1 = form.conferenceId !== null

  const goNext = () => {
    if (!validateStep(step)) return
    setStep((s) => s + 1)
  }

  const handleSubmit = () => {
    setSubmitError(null)
    startTransition(async () => {
      const payload: PublicRegistrationData = {
        fullName: form.fullName,
        email: form.email,
        organization: form.organization || undefined,
        conferenceId: form.conferenceId!,
        joinTheGala: form.joinTheGala,
        notes: form.notes || undefined,
      }
      const res = await createRegistrationPublic(payload)
      if (res.success) setSubmitted(true)
      else setSubmitError(res.error ?? 'Something went wrong. Please try again.')
    })
  }

  const conferenceName = conferences.find((c) => c.id === form.conferenceId)?.title ?? '—'

  // ── Success State ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <FormContainer>
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'oklch(0.65 0.18 155 / 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: 32,
            }}
          >
            ✓
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--navy)',
              marginBottom: '0.5rem',
            }}
          >
            Registration Submitted!
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Thank you for registering for <strong>{conferenceName}</strong>.
            <br />
            You will receive a confirmation email at <strong>{form.email}</strong>.
          </p>
        </div>
      </FormContainer>
    )
  }

  // ── Form Steps ────────────────────────────────────────────────────────────
  return (
    <FormContainer>
      {/* Progress Tracker */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.8125rem',
            color: 'var(--muted-foreground)',
          }}
        >
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
          <span>{STEPS[step - 1]}</span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: 'var(--border)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(step / TOTAL_STEPS) * 100}%`,
              background: 'var(--cyan)',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* ── STEP 1: Select Conference ──────────────────────────────────────── */}
      {step === 1 && (
        <StepSection
          title="Select Conference"
          subtitle="Choose the conference you want to register for."
        >
          {loadingConferences ? (
            <Spinner />
          ) : conferences.length === 0 ? (
            <EmptyText>No active conferences at the moment.</EmptyText>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {conferences.map((conf) => (
                <OptionCard
                  key={conf.id}
                  selected={form.conferenceId === conf.id}
                  onClick={() => set('conferenceId', conf.id)}
                  radio
                >
                  {conf.title}
                </OptionCard>
              ))}
            </div>
          )}
          <NavRow>
            <div />
            <NavBtn onClick={goNext} disabled={!canProceedStep1}>
              Continue
            </NavBtn>
          </NavRow>
        </StepSection>
      )}

      {/* ── STEP 2: Personal Information ───────────────────────────────────── */}
      {step === 2 && (
        <StepSection
          title="Personal Information"
          subtitle="Please provide your personal details."
        >
          <FieldGroup>
            <FieldLabel htmlFor="fullName" required>
              Full Name
            </FieldLabel>
            <TextInput
              id="fullName"
              value={form.fullName}
              onChange={(v) => set('fullName', v)}
              placeholder="Dr. Nguyen Van A"
              maxLength={100}
              error={validationErrors.fullName}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="email" required>
              Email Address
            </FieldLabel>
            <TextInput
              id="email"
              type="email"
              value={form.email}
              onChange={(v) => set('email', v)}
              placeholder="your@email.com"
              error={validationErrors.email}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="organization">Organization / Institution</FieldLabel>
            <TextInput
              id="organization"
              value={form.organization}
              onChange={(v) => set('organization', v)}
              placeholder="e.g. Seoul National University Hospital"
              maxLength={200}
            />
          </FieldGroup>

          <NavRow>
            <NavBtn onClick={() => setStep(1)} secondary>
              Back
            </NavBtn>
            <NavBtn onClick={goNext}>Continue</NavBtn>
          </NavRow>
        </StepSection>
      )}

      {/* ── STEP 3: Registration Fee + Gala + Notes ────────────────────────── */}
      {step === 3 && (
        <StepSection
          title="Registration Fee"
          subtitle="Review the conference fees and provide additional details."
        >
          {/* Fee Information Panel */}
          <div
            style={{
              background: 'linear-gradient(135deg, oklch(0.97 0.02 250), oklch(0.97 0.01 195))',
              border: '1px solid oklch(0.88 0.04 250)',
              borderRadius: 12,
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Fee Cards */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {/* Early Bird */}
              <div
                style={{
                  flex: '1 1 200px',
                  background: 'var(--background)',
                  borderRadius: 10,
                  padding: '1.25rem',
                  border: '1.5px solid oklch(0.65 0.18 155 / 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'oklch(0.65 0.18 155)',
                    color: '#fff',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.625rem',
                    borderRadius: '0 8px 0 8px',
                    letterSpacing: '0.02em',
                  }}
                >
                  EARLY BIRD
                </div>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--muted-foreground)',
                    marginBottom: '0.125rem',
                  }}
                >
                  Early Bird Registration
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--muted-foreground)',
                    marginBottom: '0.75rem',
                  }}
                >
                  On or before April 15, 2026
                </p>
                <p
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 800,
                    color: 'oklch(0.45 0.15 155)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  1.500.000 VND
                </p>
              </div>

              {/* Late Registration */}
              <div
                style={{
                  flex: '1 1 200px',
                  background: 'var(--background)',
                  borderRadius: 10,
                  padding: '1.25rem',
                  border: '1.5px solid oklch(0.75 0.12 50 / 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'oklch(0.65 0.15 50)',
                    color: '#fff',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.625rem',
                    borderRadius: '0 8px 0 8px',
                    letterSpacing: '0.02em',
                  }}
                >
                  LATE
                </div>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--muted-foreground)',
                    marginBottom: '0.125rem',
                  }}
                >
                  Late Registration
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--muted-foreground)',
                    marginBottom: '0.75rem',
                  }}
                >
                  After April 15, 2026
                </p>
                <p
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 800,
                    color: 'oklch(0.55 0.12 50)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  2.500.000 VND
                </p>
              </div>
            </div>

            {/* Fee Includes/Excludes */}
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--foreground)',
                lineHeight: 1.7,
                marginBottom: '1rem',
              }}
            >
              The above fee includes the <strong>Gala Dinner</strong> and{' '}
              <strong>CME registration</strong>. The fee does not include accommodation or travel
              expenses.
            </p>

            {/* Important Notes */}
            <div
              style={{
                background: 'oklch(0.98 0.01 80)',
                border: '1px solid oklch(0.88 0.06 80)',
                borderRadius: 8,
                padding: '0.875rem 1rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'oklch(0.45 0.1 50)',
                  marginBottom: '0.375rem',
                }}
              >
                ⓘ Important notes:
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.125rem',
                  fontSize: '0.8125rem',
                  color: 'var(--foreground)',
                  lineHeight: 1.7,
                }}
              >
                <li>
                  Presenters with accepted abstracts are exempt from the conference registration fee.
                </li>
                <li>
                  For international participants, a separate policy applies; please contact the
                  organizing committee for on-site registration.
                </li>
              </ul>
            </div>
          </div>

          {/* Join Gala Dinner */}
          <FieldGroup>
            <FieldLabel>Join the Gala Dinner?</FieldLabel>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <OptionCard
                selected={form.joinTheGala === true}
                onClick={() => set('joinTheGala', true)}
                radio
              >
                Yes, I&apos;d like to attend
              </OptionCard>
              <OptionCard
                selected={form.joinTheGala === false}
                onClick={() => set('joinTheGala', false)}
                radio
              >
                No, thank you
              </OptionCard>
            </div>
          </FieldGroup>

          {/* Notes */}
          <FieldGroup>
            <FieldLabel htmlFor="notes">
              Notes{' '}
              <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>(optional)</span>
            </FieldLabel>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Dietary restrictions, accessibility needs, or any other notes…"
              maxLength={1000}
              rows={3}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius)',
                border: '1.5px solid var(--border)',
                background: 'var(--background)',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
            />
            {validationErrors.notes && (
              <p
                style={{ color: 'var(--destructive)', fontSize: '0.8125rem', marginTop: '0.25rem' }}
              >
                {validationErrors.notes}
              </p>
            )}
          </FieldGroup>

          <NavRow>
            <NavBtn onClick={() => setStep(2)} secondary>
              Back
            </NavBtn>
            <NavBtn onClick={goNext}>Continue</NavBtn>
          </NavRow>
        </StepSection>
      )}

      {/* ── STEP 4: Vietnam CME ─────────────────────────────────────────────── */}
      {step === 4 && (
        <StepSection
          title="CME Credits (Vietnam)"
          subtitle="Are you a participant based in Vietnam?"
        >
          <p
            style={{
              color: 'var(--muted-foreground)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              marginBottom: '1rem',
            }}
          >
            For participants from Vietnam, please scan the QR code below to complete your
            registration information and obtain CME credits.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <OptionCard
              selected={vietnamParticipant === true}
              onClick={() => setVietnamParticipant(true)}
              radio
            >
              Yes, I am based in Vietnam
            </OptionCard>
            <OptionCard
              selected={vietnamParticipant === false}
              onClick={() => setVietnamParticipant(false)}
              radio
            >
              No, I am not based in Vietnam
            </OptionCard>
          </div>

          {vietnamParticipant === true && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'oklch(0.97 0.01 195)',
                border: '1px solid oklch(0.85 0.05 195)',
                borderRadius: 'var(--radius)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: 'var(--navy)',
                  marginBottom: '1rem',
                  fontSize: '0.9375rem',
                }}
              >
                Scan this QR code to register for CME credits
              </p>
              <Image
                className="m-auto"
                width={200}
                height={200}
                src="/vietnam-cme-qr.png"
                alt="Vietnam CME QR Code"
              />
              <p
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--muted-foreground)',
                }}
              >
                After scanning, you may continue with your registration.
              </p>
            </div>
          )}

          <NavRow>
            <NavBtn onClick={() => setStep(3)} secondary>
              Back
            </NavBtn>
            <NavBtn onClick={goNext} disabled={vietnamParticipant === null}>
              Continue
            </NavBtn>
          </NavRow>
        </StepSection>
      )}

      {/* ── STEP 5: Review & Submit ─────────────────────────────────────────── */}
      {step === 5 && (
        <StepSection
          title="Review & Register"
          subtitle="Please review your information before submitting."
        >
          <div
            style={{
              background: 'oklch(0.97 0 0)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
            }}
          >
            <ReviewRow label="Conference" value={conferenceName} />
            <ReviewRow label="Full Name" value={form.fullName} />
            <ReviewRow label="Email" value={form.email} />
            {form.organization && <ReviewRow label="Organization" value={form.organization} />}
            <ReviewRow label="Gala Dinner" value={form.joinTheGala ? '✓ Yes' : '✗ No'} />
            {form.notes && <ReviewRow label="Notes" value={form.notes} />}
          </div>

          {submitError && (
            <div
              style={{
                background: 'oklch(0.95 0.05 25)',
                color: 'var(--destructive)',
                borderRadius: 'var(--radius)',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                marginTop: '1rem',
              }}
            >
              {submitError}
            </div>
          )}

          <NavRow>
            <NavBtn onClick={() => setStep(4)} secondary>
              Back
            </NavBtn>
            <NavBtn onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Submitting…' : 'Submit Registration'}
            </NavBtn>
          </NavRow>
        </StepSection>
      )}
    </FormContainer>
  )
}

function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 620,
        margin: '0 auto',
        background: 'var(--card)',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        padding: '2.5rem 2rem',
        border: '1px solid var(--border)',
      }}
    >
      <h1
        style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--navy)',
          marginBottom: '0.25rem',
          letterSpacing: '-0.01em',
        }}
      >
        Conference Registration
      </h1>
      <p
        style={{
          color: 'var(--muted-foreground)',
          fontSize: '0.95rem',
          marginBottom: '2rem',
          lineHeight: 1.5,
        }}
      >
        Register for an upcoming conference.
      </p>
      {children}
    </div>
  )
}

function StepSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: '0.25rem',
        }}
      >
        {title}
      </h2>
      <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        {subtitle}
      </p>
      {children}
    </div>
  )
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: '1.25rem' }}>{children}</div>
}

function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'block',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: 'var(--foreground)',
        marginBottom: '0.375rem',
      }}
    >
      {children}
      {required && <span style={{ color: 'var(--destructive)', marginLeft: 2 }}>*</span>}
    </label>
  )
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  error,
  type = 'text',
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  error?: string
  type?: string
}) {
  return (
    <>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          width: '100%',
          padding: '0.625rem 0.75rem',
          borderRadius: 'var(--radius)',
          border: `1.5px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
          background: 'var(--background)',
          fontSize: '0.9375rem',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
      {error && (
        <p style={{ color: 'var(--destructive)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0.625rem 0',
        borderBottom: '1px solid var(--border)',
        gap: '1rem',
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontSize: '0.875rem',
          color: 'var(--muted-foreground)',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '0.9375rem',
          color: 'var(--foreground)',
          textAlign: 'right',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function NavRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2rem',
        gap: '0.75rem',
      }}
    >
      {children}
    </div>
  )
}

function OptionCard({
  children,
  selected,
  onClick,
  radio,
}: {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
  radio?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius)',
        border: `1.5px solid ${selected ? 'var(--cyan)' : 'var(--border)'}`,
        background: selected ? 'oklch(0.65 0.18 195 / 0.07)' : 'var(--background)',
        color: 'var(--foreground)',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        fontSize: '0.9375rem',
        transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {radio && (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            flexShrink: 0,
            border: `2px solid ${selected ? 'var(--cyan)' : 'var(--border)'}`,
            background: selected ? 'var(--cyan)' : 'transparent',
            display: 'inline-block',
            transition: 'all 0.15s',
          }}
        />
      )}
      <span style={{ textAlign: 'left' }}>{children}</span>
    </button>
  )
}

function NavBtn({
  children,
  onClick,
  disabled,
  secondary,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  secondary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.6875rem 1.75rem',
        borderRadius: 'var(--radius)',
        fontWeight: 600,
        fontSize: '0.9375rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: secondary ? '1.5px solid var(--border)' : 'none',
        background: secondary ? 'transparent' : 'var(--navy)',
        color: secondary ? 'var(--foreground)' : 'var(--primary-foreground)',
        transition: 'opacity 0.15s',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>{children}</p>
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div
        style={{
          width: 28,
          height: 28,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--cyan)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  )
}
