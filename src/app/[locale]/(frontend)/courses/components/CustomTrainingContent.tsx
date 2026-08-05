import { useTranslations } from 'next-intl'

import RichText from '@/components/RichText'

/* ─────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */

// Mirrors the shape inferred by payload-types for custom_training_content.
type LexicalContent = {
  root: {
    type: string
    children: { type: any; version: number; [k: string]: unknown }[]
    direction: ('ltr' | 'rtl') | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
  }
  [k: string]: unknown
}

interface CustomTrainingContentProps {
  content?: LexicalContent | null
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CustomTrainingContent
 *
 * Renders the `custom_training_content` rich-text field for on-demand courses.
 * Returns null when the field is absent or its Lexical root has no children,
 * so no empty section ever appears on the page.
 * ──────────────────────────────────────────────────────────────────────────── */
export function CustomTrainingContent({ content }: CustomTrainingContentProps) {
  const t = useTranslations('courses')

  // Guard: nothing to render
  if (!content || !content.root?.children?.length) return null

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-clinical text-2xl md:text-3xl mb-8">
          {t('customTraining.title')}
        </h2>

        {/* Rich-text content
            prose          – activates Tailwind Typography typography defaults
            prose-lg       – slightly larger base font size for readability
            max-w-none     – let our container control width, not prose's own max-w
            prose-table:*  – table borders for Word-pasted content
        */}
        <RichText
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data={content as any}
          enableGutter={false}
          enableProse={false}
          className={[
            'prose prose-lg max-w-none',
            'dark:prose-invert',
            // Table styles (Word-paste safe)
            'prose-table:border prose-table:border-border',
            'prose-td:border prose-td:px-4 prose-td:py-2',
            'prose-th:bg-muted prose-th:px-4 prose-th:py-2',
          ].join(' ')}
        />
      </div>
    </section>
  )
}
