'use client'

import { RichTextParser } from '@/components/RichTextParser'
import { Button } from '@/components/ui/button'
import { isCategory } from '@/helpers'
import type { Category, Topic } from '@/payload-types'
import { isObject } from '@/utilities/deepMerge'
import { ChevronRight, FileText, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface TopicExplorerProps {
  topics: Topic[]
  conferenceId: number
}

export function TopicExplorer({ topics, conferenceId }: TopicExplorerProps) {
  const [activeTopic, setActiveTopic] = useState(topics[0])
  const router = useRouter()

  const onSubmitAbstract = useCallback(() => {
    const allRelatedConferences = activeTopic.conference?.docs

    if (!allRelatedConferences?.length) return

    const relatedConferenceIds = allRelatedConferences.map((item) =>
      isObject(item) ? item?.id || -1 : item,
    )
    if (!relatedConferenceIds.length) return

    if (!relatedConferenceIds.includes(conferenceId)) return

    return router.push(
      `/dashboard/collections/abstracts?conference=${conferenceId}&topic=${activeTopic.id}`,
    )
  }, [activeTopic, conferenceId])

  // Get category name from topic
  const getCategoryName = (category: number | Category): string => {
    if (isCategory(category)) {
      return category.name
    }
    return 'Uncategorized'
  }

  // Dynamic category colors based on category name
  const getCategoryColor = (categoryName: string): string => {
    const colorMap: Record<string, string> = {
      'Surgical Oncology': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      'Translational Research': 'bg-violet-500/10 text-violet-600 border-violet-500/20',
      'Clinical Research': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      'Basic Science': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      Technology: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      'Public Health': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      Diagnostics: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      Therapeutics: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    }
    return colorMap[categoryName] || 'bg-slate-100 text-slate-600 border-slate-200'
  }

  if (!topics || topics.length === 0) {
    return (
      <section className="py-8 sm:py-12">
        <div className="text-center text-slate-500">No topics available for this conference.</div>
      </section>
    )
  }

  const activeCategoryName = getCategoryName(activeTopic.category)

  return (
    <section className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <span className="font-mono text-[10px] sm:text-xs tracking-widest text-cyan-600 uppercase">
          Research Topics
        </span>
        <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
          Topic Explorer
        </h2>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Browse conference topics and submit your research abstracts
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-[400px] lg:min-h-[600px]">
        {/* Topic Sidebar */}
        <div className="lg:w-80 shrink-0">
          <div className="rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white/70 backdrop-blur-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-[#E2E8F0] bg-slate-50/50">
              <h3 className="font-medium text-[#0F172A] flex items-center gap-2 text-sm sm:text-base">
                <FileText className="h-4 w-4 text-cyan-600" />
                Conference Topics
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                {topics.length} topics available
              </p>
            </div>
            <nav className="p-2 max-h-[200px] sm:max-h-[300px] lg:max-h-[500px] overflow-y-auto">
              {topics.map((topic) => {
                const categoryName = getCategoryName(topic.category)
                const isActive = activeTopic.id === topic.id

                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopic(topic)}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-lg sm:rounded-xl mb-1 transition-all duration-200 group ${
                      isActive ? 'bg-[#0F172A] text-white' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium text-sm leading-snug ${
                          isActive ? 'text-white' : 'text-[#0F172A]'
                        }`}
                      >
                        {topic.name}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 ml-2 transition-transform ${
                          isActive
                            ? 'text-cyan-400 translate-x-0'
                            : 'text-slate-400 -translate-x-1 group-hover:translate-x-0'
                        }`}
                      />
                    </div>
                    <span
                      className={`inline-block mt-1.5 sm:mt-2 px-2 py-0.5 text-[10px] sm:text-xs rounded-full border ${
                        isActive
                          ? 'bg-white/10 text-cyan-300 border-cyan-400/30'
                          : getCategoryColor(categoryName)
                      }`}
                    >
                      {categoryName}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Research Pane */}
        <div className="flex-1 rounded-xl sm:rounded-2xl border border-[#E2E8F0] bg-white/80 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-[#E2E8F0] bg-linear-to-r from-slate-50/80 to-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div>
                <span
                  className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full border mb-2 sm:mb-3 ${getCategoryColor(activeCategoryName)}`}
                >
                  {activeCategoryName}
                </span>
                <h3 className="text-lg sm:text-2xl font-semibold text-[#0F172A] tracking-tight leading-snug">
                  {activeTopic.name}
                </h3>
              </div>
              <span className="font-mono text-[10px] sm:text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded self-start">
                ID: {activeTopic.id}
              </span>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <article className="prose prose-slate max-w-none prose-headings:text-[#0F172A] prose-p:text-slate-600 prose-p:leading-relaxed">
              <div
                className="font-serif text-[15px] sm:text-[17px] leading-[1.7] sm:leading-[1.8] text-slate-700"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {activeTopic.description && (
                  <p className="mb-4 font-medium text-slate-800">{activeTopic.description}</p>
                )}

                {activeTopic.content ? (
                  <RichTextParser content={activeTopic.content} />
                ) : (
                  <div className="text-slate-500 italic">No content available for this topic.</div>
                )}
              </div>
            </article>
          </div>

          <div className="p-3 sm:p-4 border-t border-[#E2E8F0] bg-linear-to-r from-cyan-50/50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Interested in presenting your research on this topic?
              </p>
              <Button
                onClick={onSubmitAbstract}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white gap-2 w-full sm:w-auto text-sm"
              >
                <Send className="h-4 w-4" />
                <span className="sm:hidden">Submit Abstract</span>
                <span className="hidden sm:inline">Submit Abstract for this Topic</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
