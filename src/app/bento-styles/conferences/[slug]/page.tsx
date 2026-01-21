import type { Category, Post, Topic, UserGroup } from '@/payload-types'
import { DetailHeader } from './components/detail-header'
import { LogisticsBento } from './components/logistics-bento'
import { ScientificTimeline } from './components/scientific-timeline'
import { TopicExplorer } from './components/topic-exploer'

const sampleCategory: Category = {
  id: 1,
  name: 'Surgical Oncology',
  description: 'Research and clinical advances in surgical oncology',
  active: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

const sampleCategories: Record<string, Category> = {
  surgical: sampleCategory,
  translational: {
    id: 2,
    name: 'Translational Research',
    description: 'Bridging laboratory discoveries to clinical applications',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  clinical: {
    id: 3,
    name: 'Clinical Research',
    description: 'Clinical trials and patient outcomes research',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  technology: {
    id: 4,
    name: 'Technology',
    description: 'Medical technology and innovation',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  publicHealth: {
    id: 5,
    name: 'Public Health',
    description: 'Public health initiatives and epidemiology',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
}

const sampleHost: UserGroup = {
  id: 1,
  name: 'Korean Gastric Cancer Association',
  description: 'Leading organization for gastric cancer research and treatment',
  createdAt: '',
  updatedAt: '',
}

const sampleTopics: Topic[] = [
  {
    id: 1,
    name: 'AI in Endoscopy',
    description:
      'Exploring artificial intelligence applications in endoscopic procedures for improved diagnosis and treatment planning.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Artificial intelligence is revolutionizing endoscopic procedures, enabling real-time detection of polyps, early-stage cancers, and other abnormalities with unprecedented accuracy. This topic explores the latest developments in AI-assisted endoscopy and their clinical applications.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Key areas include computer-aided detection (CADe) and computer-aided diagnosis (CADx) systems, deep learning algorithms for lesion characterization, and the integration of AI into clinical workflows. We will examine validation studies, regulatory considerations, and implementation challenges.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Submissions are encouraged on topics including novel AI algorithms, clinical validation studies, human-AI collaboration, and the future of AI-enhanced endoscopy in gastric cancer screening and surveillance.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    active: true,
    category: sampleCategories.technology,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'PIPAC Protocols',
    description:
      'Pressurized Intraperitoneal Aerosol Chemotherapy (PIPAC) treatment protocols and clinical outcomes.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'PIPAC represents a significant advancement in the treatment of peritoneal metastases, offering improved drug distribution and tissue penetration compared to traditional intraperitoneal chemotherapy. This session covers standardized protocols and emerging applications.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Topics include patient selection criteria, optimal drug combinations and dosing, procedural techniques, and management of complications. We will review the latest clinical trial data and discuss the integration of PIPAC into multimodal treatment strategies.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    active: true,
    category: sampleCategories.surgical,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Immunotherapy Biomarkers',
    description:
      'Predictive biomarkers for immunotherapy response in gastric cancer patients.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Identifying patients most likely to benefit from immunotherapy remains a critical challenge in gastric cancer treatment. This topic examines established and emerging biomarkers including PD-L1 expression, microsatellite instability, tumor mutational burden, and novel immune signatures.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'We will discuss standardization of biomarker testing, the role of liquid biopsies, and the development of composite biomarker panels for improved patient selection. Translational research connecting molecular profiles to clinical outcomes is particularly encouraged.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    active: true,
    category: sampleCategories.translational,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Minimally Invasive Surgery Outcomes',
    description:
      'Long-term outcomes and quality of life after minimally invasive gastric cancer surgery.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Minimally invasive gastrectomy has become the standard of care for early gastric cancer in many centers. This session examines long-term oncological outcomes, functional recovery, and quality of life data from large cohort studies and randomized trials.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Topics include laparoscopic versus robotic approaches, learning curve considerations, and the extension of minimally invasive techniques to advanced gastric cancer. Patient-reported outcomes and functional assessments are key areas of focus.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    active: true,
    category: sampleCategories.clinical,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Global Screening Initiatives',
    description:
      'Population-based gastric cancer screening programs and their impact on early detection rates.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Gastric cancer screening programs have demonstrated significant success in reducing mortality in high-incidence regions. This topic explores the design, implementation, and outcomes of national screening programs in Korea, Japan, and emerging initiatives worldwide.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Key considerations include cost-effectiveness analysis, risk stratification approaches, and the adaptation of screening strategies to different healthcare systems and populations. The role of novel biomarkers and AI-enhanced imaging in population screening will also be discussed.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    active: true,
    category: sampleCategories.publicHealth,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

const conferenceData: Post = {
  id: 1,
  title: '17th International Gastric Cancer Congress',
  theme:
    'Advancing Precision Medicine in Gastric Cancer: From Bench to Bedside',
  active: true,
  host: sampleHost,
  venueName: 'COEX Convention Center',
  venueCity: 'Seoul, South Korea',
  topics: sampleTopics,
  abstractSubmissionDeadline: '2026-03-15T23:59:59.000Z',
  notificationOfAcceptanceDate: '2026-05-01T00:00:00.000Z',
  earlyRegistrationDeadline: '2026-06-30T23:59:59.000Z',
  startDate: '2026-09-10T08:00:00.000Z',
  endDate: '2026-09-13T18:00:00.000Z',
  contactEmails: [
    { email: 'secretariat@igcc2026.org', id: '1' },
    { email: 'registration@igcc2026.org', id: '2' },
    { email: 'abstracts@igcc2026.org', id: '3' },
  ],
  contactPhones: [
    { phone: '+82 2 1234 5678', id: '1' },
    { phone: '+82 2 1234 5679', id: '2' },
  ],
  meta: {
    title: 'IGCC 2026 - International Gastric Cancer Congress',
    description:
      'Join leading experts at the 17th International Gastric Cancer Congress in Seoul, featuring cutting-edge research presentations, surgical demonstrations, and collaborative discussions.',
  },
  slug: 'igcc-2026',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-06-01T00:00:00.000Z',
  _status: 'published',
}

const getTopics = (conference: Post): Topic[] => {
  if (!conference.topics) return []
  return conference.topics.filter(
    (t): t is Topic => typeof t === 'object' && t !== null,
  )
}

export default function ConferenceDetailPage() {
  const topics = getTopics(conferenceData)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DetailHeader
        conference={conferenceData}
        attendees={2500} //TODO
        cmeCredits={24} //TODO
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {topics.length > 0 && <TopicExplorer topics={topics} />}

        <ScientificTimeline
          abstractSubmissionDeadline={conferenceData.abstractSubmissionDeadline}
          notificationOfAcceptanceDate={
            conferenceData.notificationOfAcceptanceDate
          }
          earlyRegistrationDeadline={conferenceData.earlyRegistrationDeadline}
          startDate={conferenceData.startDate}
          endDate={conferenceData.endDate}
        />

        <LogisticsBento
          conference={conferenceData}
          venueAddress="513 Yeongdong-daero, Gangnam-gu, Seoul 06164"
          floorPlanUrl="#"
        />
      </main>
    </div>
  )
}
