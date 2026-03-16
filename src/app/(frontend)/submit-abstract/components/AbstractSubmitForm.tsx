'use client'

import { formatDate } from '@/utilities/dateUtils'
import {
  createAbstractPublic,
  type PublicAbstractData,
} from '@/app/actions/abstracts/createAbstractPublic'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'
import { z } from 'zod'
import { AbstractFileUploader, type UploadedFileData } from './AbstractFileUploader'
// ── Zod schemas per step ──────────────────────────────────────────────────
const stepLangSchema = z.object({
  presentationLanguage: z.enum(['english', 'vietnamese'], {
    required_error: 'Please select a presentation language.',
  }),
})

const step4Schema_info = z.object({
  submitterName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  submitterEmail: z.string().email('Enter a valid email address'),
  submitterOrganization: z
    .string()
    .max(200, 'Organization must be at most 200 characters')
    .optional(),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(300, 'Title must be at most 300 characters'),
})

const step5Schema = z.object({
  aim: z
    .string()
    .min(20, 'Aim must be at least 20 characters')
    .max(2000, 'Aim must be at most 2000 characters'),
  methods: z
    .string()
    .min(20, 'Methods must be at least 20 characters')
    .max(3000, 'Methods must be at most 3000 characters'),
  results: z
    .string()
    .min(20, 'Results must be at least 20 characters')
    .max(3000, 'Results must be at most 3000 characters'),
  conclusion: z
    .string()
    .min(10, 'Conclusion must be at least 10 characters')
    .max(2000, 'Conclusion must be at most 2000 characters'),
})

// ── Types ─────────────────────────────────────────────────────────────────
type Conference = { id: number; title: string; abstractSubmissionDeadline?: string }
type Topic = { id: number; name: string }

type FormState = {
  conferenceId: number | null
  topicId: number | 'other' | null
  otherTopic: string
  presentationLanguage: 'english' | 'vietnamese' | null
  submitterName: string
  submitterEmail: string
  submitterOrganization: string
  title: string
  nameOfStudy: string
  aim: string
  methods: string
  results: string
  conclusion: string
  keywords: { word: string }[]
}

const TOTAL_STEPS = 8
const STEPS = [
  'Select Conference',
  'Select Topic',
  'Presentation Language',
  'Your Information',
  'Abstract Body',
  'Keywords',
  'Upload File',
  'Review & Submit',
]

// ── Main Component ────────────────────────────────────────────────────────
export function AbstractSubmitForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [uploadedFile, setUploadedFile] = useState<UploadedFileData | null>(null)
  const [isFileUploading, setIsFileUploading] = useState(false)

  const [form, setForm] = useState<FormState>({
    conferenceId: null,
    topicId: null,
    otherTopic: '',
    presentationLanguage: null,
    submitterName: '',
    submitterEmail: '',
    submitterOrganization: '',
    title: '',
    nameOfStudy: '',
    aim: '',
    methods: '',
    results: '',
    conclusion: '',
    keywords: [{ word: '' }],
  })

  const [conferences, setConferences] = useState<Conference[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loadingConferences, setLoadingConferences] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(false)

  // Pre-select conference + topic from ?conference=&topic= query params
  useEffect(() => {
    const confId = searchParams.get('conference')
    const topicId = searchParams.get('topic')
    if (confId || topicId) {
      setForm((prev) => ({
        ...prev,
        conferenceId: confId ? Number(confId) : prev.conferenceId,
        topicId: topicId ? Number(topicId) : prev.topicId,
      }))
      // Skip to step 3 (Presentation Language) since conference & topic are pre-selected
      if (confId && topicId) setStep(3)
    }
  }, [searchParams])

  const set = (key: keyof FormState, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setValidationErrors((prev) => ({ ...prev, [key]: '' }))
  }

  useEffect(() => {
    fetch('/api/posts?where[active][equals]=true&limit=50&depth=0')
      .then((r) => r.json())
      .then((d) => setConferences(d?.docs ?? []))
      .catch(() => setConferences([]))
      .finally(() => setLoadingConferences(false))
  }, [])

  useEffect(() => {
    if (!form.conferenceId) {
      setTopics([])
      return
    }
    setLoadingTopics(true)
    fetch(
      `/api/topics?where[conference][in][0]=${form.conferenceId}&where[active][equals]=true&limit=100&depth=0`,
    )
      .then((r) => r.json())
      .then((d) => setTopics(d?.docs ?? []))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false))
  }, [form.conferenceId])

  const validateStep = (currentStep: number): boolean => {
    setValidationErrors({})
    if (currentStep === 3) {
      const result = stepLangSchema.safeParse({
        presentationLanguage: form.presentationLanguage,
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
    if (currentStep === 4) {
      const result = step4Schema_info.safeParse({
        submitterName: form.submitterName,
        submitterEmail: form.submitterEmail,
        submitterOrganization: form.submitterOrganization,
        title: form.title,
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
    if (currentStep === 5) {
      const result = step5Schema.safeParse({
        aim: form.aim,
        methods: form.methods,
        results: form.results,
        conclusion: form.conclusion,
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

  const goNext = () => {
    if (!validateStep(step)) return
    setStep((s) => s + 1)
  }

  const handleSubmit = () => {
    setSubmitError(null)
    startTransition(async () => {
      const payload: PublicAbstractData = {
        submitterName: form.submitterName,
        submitterEmail: form.submitterEmail,
        submitterOrganization: form.submitterOrganization || undefined,
        presentationLanguage: form.presentationLanguage!,
        title: form.title,
        conference: form.conferenceId!,
        topic: form.topicId === 'other' ? 'other' : form.topicId!,
        ...(form.topicId === 'other' && form.otherTopic ? { otherTopic: form.otherTopic } : {}),
        nameOfStudy: form.nameOfStudy || undefined,
        aim: form.aim,
        methods: form.methods,
        results: form.results,
        conclusion: form.conclusion,
        keywords: form.keywords.filter((k) => k.word.trim()),
        ...(uploadedFile?.publicFileId ? { publicFileId: Number(uploadedFile.publicFileId) } : {}),
      }
      const res = await createAbstractPublic(payload)
      if (res.success) setSubmitted(true)
      else setSubmitError(res.error ?? 'Something went wrong. Please try again.')
    })
  }

  const canProceedBasic = () => {
    if (step === 1) return !!form.conferenceId
    if (step === 2) {
      if (form.topicId === 'other') return form.otherTopic.trim().length > 0
      return !!form.topicId
    }
    if (step === 3) return !!form.presentationLanguage
    // Block navigation while a file upload is still in flight
    if (step === 7 && isFileUploading) return false
    return true
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div style={cardStyle}>
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--foreground)',
                marginBottom: '0.75rem',
              }}
            >
              Abstract Submitted Successfully
            </h1>
            <p
              style={{
                color: 'var(--muted-foreground)',
                lineHeight: 1.7,
                maxWidth: 400,
                margin: '0 auto',
              }}
            >
              Thank you, <strong>{form.submitterName}</strong>. A confirmation will be sent to{' '}
              <strong>{form.submitterEmail}</strong> once a decision has been made.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 800,
            color: 'var(--foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Abstract Submission
        </h1>
        <p style={{ color: 'var(--muted-foreground)', marginTop: '0.375rem', fontSize: '0.9rem' }}>
          Step {step} of {TOTAL_STEPS} —{' '}
          <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{STEPS[step - 1]}</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: 4,
          background: 'var(--border)',
          borderRadius: 99,
          marginBottom: '1.75rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(step / TOTAL_STEPS) * 100}%`,
            background: 'linear-gradient(90deg, var(--navy), var(--cyan))',
            borderRadius: 99,
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      {/* Card — fixed height + scroll prevents layout shift */}
      <div style={{ ...cardStyle, height: 560, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          {/* ── STEP 1: Conference ────────────────────────────────────────── */}
          {step === 1 && (
            <Step title="Select a Conference" sub="Choose the conference you are submitting to.">
              {loadingConferences ? (
                <Spinner />
              ) : conferences.length === 0 ? (
                <EmptyText>No active conferences found.</EmptyText>
              ) : (
                <OptionList>
                  {conferences.map((conf) => (
                    <OptionCard
                      key={conf.id}
                      selected={form.conferenceId === conf.id}
                      onClick={() => {
                        set('conferenceId', conf.id)
                        set('topicId', null)
                      }}
                    >
                      <span style={{ fontWeight: form.conferenceId === conf.id ? 600 : 400 }}>
                        {conf.title}
                      </span>
                      {conf.abstractSubmissionDeadline && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--muted-foreground)',
                            display: 'block',
                            marginTop: 2,
                          }}
                        >
                          Deadline: {formatDate(conf.abstractSubmissionDeadline)}
                        </span>
                      )}
                    </OptionCard>
                  ))}
                </OptionList>
              )}
            </Step>
          )}

          {/* ── STEP 2: Topic ─────────────────────────────────────────────── */}
          {step === 2 && (
            <Step title="Select a Topic" sub="Choose the topic that best matches your abstract.">
              {loadingTopics ? (
                <Spinner />
              ) : topics.length === 0 ? (
                <EmptyText>No active topics for this conference.</EmptyText>
              ) : (
                <OptionList>
                  {topics.map((t) => (
                    <OptionCard
                      key={t.id}
                      selected={form.topicId === t.id}
                      onClick={() => {
                        set('topicId', t.id)
                        set('otherTopic', '')
                      }}
                      radio
                    >
                      {t.name}
                    </OptionCard>
                  ))}

                  {/* "Other" option */}
                  <OptionCard
                    selected={form.topicId === 'other'}
                    onClick={() => set('topicId', 'other')}
                    radio
                  >
                    Other
                  </OptionCard>

                  {form.topicId === 'other' && (
                    <div style={{ marginTop: '0.25rem' }}>
                      <Field
                        label="Please specify your topic *"
                        error={validationErrors.otherTopic || ''}
                      >
                        <input
                          value={form.otherTopic}
                          onChange={(e) => set('otherTopic', e.target.value)}
                          placeholder="Enter your topic"
                          maxLength={150}
                          style={inputStyle(!!validationErrors.otherTopic)}
                        />
                      </Field>
                    </div>
                  )}
                </OptionList>
              )}
            </Step>
          )}

          {/* ── STEP 3: Presentation Language ─────────────────────────────── */}
          {step === 3 && (
            <Step
              title="Presentation Language"
              sub="Please select the language you will use for your presentation."
            >
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--muted-foreground)',
                  lineHeight: '1.6',
                  marginBottom: '1.25rem',
                  padding: '0.875rem 1rem',
                  background: 'var(--accent)',
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--primary)',
                }}
              >
                Please note that presentation slides are required to be prepared in English. The
                presentation language will help the organizing committee arrange the sessions more
                effectively, and the award structure differs between the two sessions.
              </p>
              <OptionList>
                <OptionCard
                  selected={form.presentationLanguage === 'english'}
                  onClick={() => set('presentationLanguage', 'english')}
                  radio
                >
                  English
                </OptionCard>
                <OptionCard
                  selected={form.presentationLanguage === 'vietnamese'}
                  onClick={() => set('presentationLanguage', 'vietnamese')}
                  radio
                >
                  Vietnamese
                </OptionCard>
              </OptionList>
              {validationErrors.presentationLanguage && (
                <p
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.8125rem',
                    color: 'var(--destructive)',
                  }}
                >
                  {validationErrors.presentationLanguage}
                </p>
              )}
            </Step>
          )}

          {/* ── STEP 4: Info ──────────────────────────────────────────────── */}
          {step === 4 && (
            <Step title="Your Information" sub="Tell us about yourself and your abstract title.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <TwoCol>
                  <Field label="Full Name *" error={validationErrors.submitterName}>
                    <input
                      value={form.submitterName}
                      onChange={(e) => set('submitterName', e.target.value)}
                      placeholder="Dr. Jane Smith"
                      maxLength={100}
                      style={inputStyle(!!validationErrors.submitterName)}
                    />
                  </Field>
                  <Field label="Email Address *" error={validationErrors.submitterEmail}>
                    <input
                      type="email"
                      value={form.submitterEmail}
                      onChange={(e) => set('submitterEmail', e.target.value)}
                      placeholder="jane@hospital.org"
                      style={inputStyle(!!validationErrors.submitterEmail)}
                    />
                  </Field>
                </TwoCol>
                <Field label="Organization / Institution" error="">
                  <input
                    value={form.submitterOrganization}
                    onChange={(e) => set('submitterOrganization', e.target.value)}
                    placeholder="Seoul National University Hospital"
                    maxLength={200}
                    style={inputStyle(false)}
                  />
                </Field>
                <Field label="Abstract Title *" error={validationErrors.title}>
                  <input
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Full title of your abstract"
                    maxLength={300}
                    style={inputStyle(!!validationErrors.title)}
                  />
                </Field>
                <Field label="Name of the Study (optional)" error="">
                  <input
                    value={form.nameOfStudy}
                    onChange={(e) => set('nameOfStudy', e.target.value)}
                    placeholder="e.g., The GASTRIC-2024 Study"
                    maxLength={300}
                    style={inputStyle(false)}
                  />
                </Field>
              </div>
            </Step>
          )}

          {/* ── STEP 5: Abstract Body ─────────────────────────────────────── */}
          {step === 5 && (
            <Step title="Abstract Body" sub="Complete each section clearly and concisely.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                {(
                  [
                    {
                      key: 'aim',
                      label: 'Aim of Study *',
                      placeholder: 'State the objective and rationale...',
                      rows: 3,
                      max: 2000,
                    },
                    {
                      key: 'methods',
                      label: 'Methods *',
                      placeholder: 'Study design, population, analysis...',
                      rows: 4,
                      max: 3000,
                    },
                    {
                      key: 'results',
                      label: 'Results *',
                      placeholder: 'Key quantitative and qualitative findings...',
                      rows: 4,
                      max: 3000,
                    },
                    {
                      key: 'conclusion',
                      label: 'Conclusion *',
                      placeholder: 'Clinical implications and conclusions...',
                      rows: 3,
                      max: 2000,
                    },
                  ] as const
                ).map(({ key, label, placeholder, rows, max }) => (
                  <Field key={key} label={label} error={validationErrors[key]}>
                    <textarea
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={placeholder}
                      rows={rows}
                      maxLength={max}
                      style={{
                        ...inputStyle(!!validationErrors[key]),
                        resize: 'vertical',
                        lineHeight: 1.6,
                      }}
                    />
                  </Field>
                ))}
              </div>
            </Step>
          )}

          {/* ── STEP 6: Keywords ──────────────────────────────────────────── */}
          {step === 6 && (
            <Step title="Keywords" sub="Add up to 5 keywords to help categorize your abstract.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {form.keywords.map((kw, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      value={kw.word}
                      placeholder={`Keyword ${i + 1}`}
                      maxLength={50}
                      onChange={(e) => {
                        const updated = [...form.keywords]
                        updated[i] = { word: e.target.value }
                        set('keywords', updated)
                      }}
                      style={{ ...inputStyle(false), flex: 1 }}
                    />
                    {form.keywords.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            'keywords',
                            form.keywords.filter((_, j) => j !== i),
                          )
                        }
                        style={{
                          color: 'var(--destructive)',
                          background: 'none',
                          border: 'none',
                          fontSize: '1.25rem',
                          cursor: 'pointer',
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {form.keywords.length < 5 && (
                  <button
                    type="button"
                    onClick={() => set('keywords', [...form.keywords, { word: '' }])}
                    style={{
                      color: 'var(--cyan)',
                      background: 'none',
                      border: '1.5px dashed var(--cyan)',
                      borderRadius: 'var(--radius)',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      textAlign: 'left',
                    }}
                  >
                    + Add keyword
                  </button>
                )}
              </div>
            </Step>
          )}

          {/* ── STEP 7: File Upload ───────────────────────────────────────── */}
          {step === 7 && (
            <Step
              title="Upload Abstract File"
              sub="Optionally attach a PDF of your full abstract (max 8 MB)."
            >
              <AbstractFileUploader
                onUploadSuccess={(fileData) => setUploadedFile(fileData)}
                onUploadStateChange={(uploading) => setIsFileUploading(uploading)}
              />
              {isFileUploading && (
                <p
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.8125rem',
                    color: 'var(--cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  ⏳ Upload in progress — please wait before continuing.
                </p>
              )}
              {uploadedFile && !isFileUploading && (
                <p
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.8125rem',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  ✅ Attached:{' '}
                  <strong style={{ color: 'var(--foreground)' }}>{uploadedFile.name}</strong>
                </p>
              )}
            </Step>
          )}

          {/* ── STEP 8: Review ────────────────────────────────────────────── */}
          {step === 8 && (
            <Step title="Review & Submit" sub="Please review your submission before sending.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(
                  [
                    {
                      label: 'Conference',
                      value: conferences.find((c) => c.id === form.conferenceId)?.title,
                    },
                    {
                      label: 'Topic',
                      value:
                        form.topicId === 'other'
                          ? `Other: ${form.otherTopic}`
                          : topics.find((t) => t.id === form.topicId)?.name,
                    },
                    {
                      label: 'Presentation Language',
                      value:
                        form.presentationLanguage === 'english'
                          ? 'English'
                          : form.presentationLanguage === 'vietnamese'
                            ? 'Vietnamese'
                            : '—',
                    },
                    { label: 'Name', value: form.submitterName },
                    { label: 'Email', value: form.submitterEmail },
                    form.submitterOrganization
                      ? { label: 'Organization', value: form.submitterOrganization }
                      : null,
                    { label: 'Title', value: form.title },
                    { label: 'Aim', value: form.aim, multiline: true },
                    { label: 'Methods', value: form.methods, multiline: true },
                    { label: 'Results', value: form.results, multiline: true },
                    { label: 'Conclusion', value: form.conclusion, multiline: true },
                    form.keywords.filter((k) => k.word).length > 0
                      ? {
                          label: 'Keywords',
                          value: form.keywords
                            .filter((k) => k.word)
                            .map((k) => k.word)
                            .join(', '),
                        }
                      : null,
                    uploadedFile
                      ? { label: 'Attached File', value: uploadedFile.name }
                      : { label: 'Attached File', value: 'None' },
                  ].filter(Boolean) as { label: string; value?: string; multiline?: boolean }[]
                ).map(({ label, value, multiline }) => (
                  <div
                    key={label}
                    style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.625rem' }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {label}
                    </span>
                    <p
                      style={{
                        margin: '0.2rem 0 0',
                        fontSize: '0.9rem',
                        color: 'var(--foreground)',
                        whiteSpace: multiline ? 'pre-wrap' : 'normal',
                        lineHeight: 1.6,
                      }}
                    >
                      {value || '—'}
                    </p>
                  </div>
                ))}
                {submitError && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'oklch(0.97 0.02 20)',
                      border: '1px solid var(--destructive)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--destructive)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {submitError}
                  </div>
                )}
              </div>
            </Step>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
        {step > 1 ? (
          <NavBtn onClick={() => setStep((s) => s - 1)} secondary>
            ← Back
          </NavBtn>
        ) : (
          <div />
        )}
        {step < TOTAL_STEPS ? (
          <NavBtn onClick={goNext} disabled={!canProceedBasic()}>
            Continue →
          </NavBtn>
        ) : (
          <NavBtn onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Submitting…' : 'Submit Abstract'}
          </NavBtn>
        )}
      </div>
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'var(--card)',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--border)',
  boxShadow: '0 2px 12px oklch(0.22 0.05 250 / 0.07)',
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.5625rem 0.875rem',
  borderRadius: 'var(--radius)',
  border: `1.5px solid ${hasError ? 'var(--destructive)' : 'var(--border)'}`,
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: 'var(--background)',
  color: 'var(--foreground)',
  transition: 'border-color 0.15s',
})

// ── Small components ──────────────────────────────────────────────────────
function Step({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: '0.25rem',
        }}
      >
        {title}
      </h2>
      <p
        style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.375rem' }}
      >
        {sub}
      </p>
      {children}
    </div>
  )
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--foreground)',
          marginBottom: '0.3125rem',
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--destructive)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

function OptionList({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>{children}</div>
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
        color: selected ? 'var(--foreground)' : 'var(--foreground)',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        fontSize: '0.9375rem',
        transition: 'all 0.15s',
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
