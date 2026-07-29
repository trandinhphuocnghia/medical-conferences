'use client'

import { PresenterData } from '@/app/actions/abstracts/getConferencePresenters'
import { RichTextParser } from '@/components/RichTextParser'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Award } from 'lucide-react'
import NextImage from 'next/image'

interface PresenterDetailModalProps {
  presenter: PresenterData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PresenterDetailModal({ presenter, open, onOpenChange }: PresenterDetailModalProps) {
  if (!presenter) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle className="sr-only">Presenter Details</DialogTitle>
          <DialogDescription className="sr-only">{presenter.name}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-4">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-muted border-2 border-border shadow-lg">
                    {presenter.avatarUrl ? (
                      <NextImage
                        src={presenter.avatarUrl}
                        alt={presenter.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                        <Award className="h-10 w-10 text-accent" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2">
                    {presenter.name}
                    {presenter.degrees && (
                      <span className="ml-1 text-[0.75em] opacity-70 font-medium">
                        , {presenter.degrees}
                      </span>
                    )}
                  </h2>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {presenter.bio && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-navy mb-3">About</h3>
                <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
                  <RichTextParser content={presenter.bio} />
                </div>
              </div>
            )}

            {/* Abstracts Section */}
            {presenter.abstracts && presenter.abstracts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-navy">
                    Presentations ({presenter.abstracts.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {presenter.abstracts.map((abstract) => (
                    <div
                      key={abstract.id}
                      className="p-4 rounded-lg bg-card border border-border hover:border-accent transition-colors"
                    >
                      <p className="font-medium text-navy mb-1">{abstract.title}</p>
                      {abstract.topicName && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-accent"></span>
                          {abstract.topicName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
