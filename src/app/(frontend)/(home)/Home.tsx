'use client'
import React, { useState, useEffect } from 'react'

// --- Utility Components (Simulating Payload Blocks) ---

// 1. Corresponds to the 'HeroBlock' defined in src/collections/Pages.ts
const HeroBlock = ({ headline, subHeadline, backgroundColor }) => (
  <section className="hero-gradient text-white py-16 sm:py-24" style={{ backgroundColor }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">{headline}</h1>
      <p className="text-xl sm:text-2xl font-light max-w-3xl mx-auto mb-8 opacity-90">
        {subHeadline}
      </p>
      <div className="flex justify-center space-x-4">
        <a
          href="#mission"
          className="px-8 py-3 bg-white text-blue-800 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Discover Our Mission
        </a>
      </div>
    </div>
  </section>
)

// 2. Corresponds to the 'RichTextBlock' defined in src/collections/Pages.ts
const RichTextBlock = ({ content }) => {
  // In a real app, 'content' would be the Lexical/Slate JSON which needs a special renderer.
  // Here, we simulate simple HTML rendering of the content text.
  const htmlContent = Array.isArray(content)
    ? content.map((p) => p.children?.[0]?.text || '').join(' ')
    : content

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div
        className="text-lg text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}

// 3. Custom Component for the Hardcoded Leadership Section
// NOTE: This content is hardcoded here but *should* ideally be a "LeadershipBlock"
// that fetches data from your 'Users' or a 'Leaders' collection via a relationship field.
const LeadershipSection = () => (
  <section id="leaders" className="py-16 sm:py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
        Our Leadership & Organizing Committee
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Leader 1 */}
        <div className="bg-white p-6 rounded-xl text-center card-shadow">
          <img
            src="https://placehold.co/128x128/9CA3AF/FFFFFF?text=Dr.A"
            alt="Dr. Lee"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
          />
          <h3 className="text-xl font-bold text-gray-900">Dr. Sun-ho Lee, MD, PhD</h3>
          <p className="text-blue-600 font-medium mb-2">
            President & Chair of Scientific Committee
          </p>
          <p className="mt-3 text-gray-700 text-sm">
            Specializing in minimally invasive gastric surgery and complex tumor staging.
          </p>
        </div>
        {/* Leader 2 */}
        <div className="bg-white p-6 rounded-xl text-center card-shadow">
          <img
            src="https://placehold.co/128x128/9CA3AF/FFFFFF?text=Dr.B"
            alt="Dr. Chen"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
          />
          <h3 className="text-xl font-bold text-gray-900">Prof. Mei Chen</h3>
          <p className="text-blue-600 font-medium mb-2">
            Vice President & Head of Translational Research
          </p>
          <p className="mt-3 text-gray-700 text-sm">
            Focus on personalized medicine using biomarkers.
          </p>
        </div>
        {/* Leader 3 */}
        <div className="bg-white p-6 rounded-xl text-center card-shadow">
          <img
            src="https://placehold.co/128x128/9CA3AF/FFFFFF?text=Dr.C"
            alt="Dr. Müller"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
          />
          <h3 className="text-xl font-bold text-gray-900">Dr. Markus Müller</h3>
          <p className="text-blue-600 font-medium mb-2">
            Secretary General & International Liaison
          </p>
          <p className="mt-3 text-gray-700 text-sm">
            Expert in oncology clinical trials and standardizing clinical guidelines.
          </p>
        </div>
      </div>
    </div>
  </section>
)

// Map of block slugs to React components
const blockComponents = {
  hero: HeroBlock,
  richTextBlock: RichTextBlock,
  leadershipSection: LeadershipSection, // Custom component to simulate a block
}

// --- SIMULATED PAYLOAD API DATA ---
// This data structure matches the schema defined in src/collections/Pages.ts
const MOCK_PAGE_DATA = {
  title: 'Our Group: Advancing Oncology Research',
  slug: 'about-us',
  is_public: true,
  layout: [
    {
      blockType: 'hero',
      headline: 'Advancing Global Oncology, Together',
      subHeadline:
        'We are a collaborative group of medical professionals and researchers dedicated to pushing the boundaries of cancer diagnosis and treatment.',
      backgroundColor: '#1e3a8a',
      id: 'block_01',
    },
    {
      blockType: 'richTextBlock',
      content:
        '<h2>Our Core Pillars and What We Bring</h2><p>Our work is built on three core pillars: interdisciplinary research, global knowledge exchange, and educational advancement. We connect surgeons, medical oncologists, and basic scientists to ensure rapid translation of findings from bench to bedside.</p>',
      id: 'block_02',
    },
    {
      // Simulating a custom block that renders the leadership section
      blockType: 'leadershipSection',
      id: 'block_03',
    },
  ],
}

// --- Main Application Component ---
const Home = () => {
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Simulate data fetching from Payload API /api/pages?where[slug][equals]=about-us
  useEffect(() => {
    // In a real app, replace this with:
    // fetch('/api/pages?where[slug][equals]=about-us')
    // then setPageData(response.docs[0]);
    setTimeout(() => {
      setPageData(MOCK_PAGE_DATA)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">
        Loading Content from Payload CMS...
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-red-600">
        Page not found (404)
      </div>
    )
  }

  // --- Render Dynamic Blocks ---
  const renderBlocks = pageData.layout.map((block) => {
    const Component = blockComponents[block.blockType]
    if (Component) {
      // Passes the content fields from the block data as props
      return <Component key={block.id} {...block} />
    }
    return (
      <div key={block.id} className="text-red-500 p-4">
        Unknown Block: {block.blockType}
      </div>
    )
  })

  return (
    <div className="bg-gray-100 min-h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          .hero-gradient {
            background-image: linear-gradient(180deg, #1e3a8a, #104e78);
          }
          .card-shadow {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
          }
        `}
      </style>

      {/* Header/Navigation Bar (Hardcoded for structure) */}
      <header className="bg-white card-shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-800">CANCER RESEARCH GROUP</div>
          <nav className="hidden md:flex space-x-6 text-gray-600 font-medium">
            <a href="#mission" className="hover:text-blue-600 transition duration-150">
              Our Mission
            </a>
            <a href="#leaders" className="hover:text-blue-600 transition duration-150">
              Leadership
            </a>
            <a
              href="#"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Abstract Submission
            </a>
          </nav>
        </div>
      </header>

      {/* Dynamic Content Rendering */}
      <main>{renderBlocks}</main>

      {/* Footer (Hardcoded for structure) */}
      <footer className="bg-gray-800 text-white py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">
            Cancer Research Group | Global Collaboration for Better Outcomes
          </p>
          <div className="text-sm text-gray-400 space-x-4">
            <span>&copy; 2025 All Rights Reserved.</span>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
