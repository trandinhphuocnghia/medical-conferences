'use client'

import { RichTextParser } from '@/components/RichTextParser'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronUp, Download, FileText, Info } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface FileAttachment {
  id: number
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
}

interface InformationSection {
  id?: string | null
  title: string
  description: any // RichText content
  attachments?: (number | FileAttachment)[] | null
}

interface InformationContentProps {
  sections: InformationSection[]
}

/** Returns a human-friendly file size string */
function formatFileSize(bytes?: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Returns a short label based on mime type */
function getFileTypeLabel(mimeType?: string | null): string {
  if (!mimeType) return 'File'
  if (mimeType.includes('pdf')) return 'PDF'
  if (mimeType.includes('word') || mimeType.includes('msword')) return 'DOC'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'PPTX'
  return 'File'
}

function SectionCard({ section, index }: { section: InformationSection; index: number }) {
  const sectionId = section.id || String(index)
  const resolvedAttachments = (section.attachments || []).filter(
    (a): a is FileAttachment => typeof a === 'object' && a !== null,
  )

  return (
    <Card id={`info-section-${sectionId}`} className="bg-card border border-border overflow-hidden scroll-mt-[132px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-4 sm:px-6 py-4 sm:py-5 border-b border-border">
        <h2 className="text-lg sm:text-xl font-bold text-navy">{section.title}</h2>
      </div>

      {/* Content */}
      <CardContent className="px-0 py-0">
        <ScrollArea className="px-4 sm:px-6 py-5 sm:py-6">
          {section.description ? (
            <div className="text-foreground leading-relaxed prose prose-slate max-w-none">
              <RichTextParser content={section.description} />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">No content available</p>
          )}
        </ScrollArea>
      </CardContent>

      {/* Attachments */}
      {resolvedAttachments.length > 0 && (
        <div className="border-t border-border px-4 sm:px-6 py-4 sm:py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Attachments ({resolvedAttachments.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {resolvedAttachments.map((file) => (
              <a
                key={file.id}
                href={file.url || '#'}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-muted/30 hover:bg-accent/5 hover:border-accent/30 transition-all"
              >
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                    {file.filename || 'Download file'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {getFileTypeLabel(file.mimeType)}
                    {file.filesize ? ` · ${formatFileSize(file.filesize)}` : ''}
                  </p>
                </div>
                <Download className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

/** Floating section navigator FAB — appears on scroll, lets user jump between sections */
function FloatingSectionNav({
  sections,
  activeSectionId,
}: {
  sections: InformationSection[]
  activeSectionId: string
}) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  if (!visible || sections.length <= 1) return null

  const handleSelect = (sectionId: string) => {
    setMenuOpen(false)
    const el = document.getElementById(`info-section-${sectionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleScrollToTop = () => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 mb-1 min-w-[220px]">
          {/* Back to top */}
          <button
            onClick={handleScrollToTop}
            className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors text-foreground hover:bg-muted/50 border-b border-border"
          >
            <ChevronUp className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <p className="text-sm font-medium">Back to Top</p>
          </button>

          <div className="px-4 py-2.5 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Jump to Section
            </p>
          </div>
          <div className="py-1">
            {sections.map((section, index) => {
              const sectionId = section.id || String(index)
              const isActive = sectionId === activeSectionId
              return (
                <button
                  key={sectionId}
                  onClick={() => handleSelect(sectionId)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Info className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <p className="text-sm font-medium truncate">{section.title}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="h-12 px-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        <Info className="h-4 w-4" />
        <span className="text-sm font-semibold hidden sm:inline">Sections</span>
        <ChevronUp
          className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  )
}

export function InformationContent({ sections }: InformationContentProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    sections[0]?.id || '0',
  )

  // Track active section based on scroll position
  const handleScroll = useCallback(() => {
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionId = sections[i].id || String(i)
      const el = document.getElementById(`info-section-${sectionId}`)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 200) {
          setActiveSectionId(sectionId)
          break
        }
      }
    }
  }, [sections])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (!sections || sections.length === 0) return null

  return (
    <>
      <section className="py-6 sm:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-navy mb-2 mt-2">Information</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Essential information and resources for conference attendees
            </p>
          </div>

          {/* Section Cards */}
          <div className="space-y-4 sm:space-y-6">
            {sections.map((section, index) => (
              <SectionCard key={section.id || index} section={section} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Floating Section Navigator */}
      <FloatingSectionNav sections={sections} activeSectionId={activeSectionId} />
    </>
  )
}
