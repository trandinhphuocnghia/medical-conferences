'use client'

import { createAbstract } from '@/app/actions/abstracts/createAbstract'
import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Topic } from '@/payload-types'
import { AbstractFormSchema, abstractFormSchema } from '@/schemas/abstract.schema'
import { toastError, toastSuccess } from '@/utilities/toast'
import { Plus, X } from 'lucide-react'
import { useRef, useTransition } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { SelectTopic } from '@/app/(frontend)/posts/[slug]/components/select-topic'
import { FileUploader } from '@/app/(frontend)/posts/[slug]/components/upload'

interface Props {
  conferenceId: number
  topics?: Topic[]
}

export function AbstractSubmitForm({ conferenceId, topics = [] }: Props) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<UseFormReturn<AbstractFormSchema>>(null)

  const onSubmit = async (data: AbstractFormSchema) => {
    startTransition(async () => {
      try {
        const res = await createAbstract({ ...data, conference: conferenceId })
        if (!res.success) {
          toastError({ message: (res?.error as Error)?.message || 'Failed to submit abstract.' })
        } else {
          toastSuccess({ message: 'Abstract submitted successfully!' })
          formRef.current?.reset({
            title: '',
            conference: conferenceId,
            topic: undefined,
            description: '',
            keywords: [],
            files: [],
          })
        }
      } catch {
        toastError({ message: 'An unexpected error occurred.' })
      }
    })
    return {}
  }

  return (
    <Form
      ref={formRef}
      mode="all"
      schema={abstractFormSchema}
      defaultValues={{
        conference: conferenceId,
        keywords: [] as string[],
        files: [] as File[],
        title: '',
        description: '',
      }}
      onSubmit={onSubmit}
      className="w-full"
    >
      {/* Hidden conference field */}
      <input type="hidden" name="conference" value={conferenceId} />

      {/* Title */}
      <FormField name="title" label="Title of your paper" required>
        {(field) => <Input placeholder="Enter the full title of your paper" {...field} />}
      </FormField>

      {/* Topic */}
      <FormField name="topic" label="Topic" required>
        {(field) => (
          <SelectTopic
            topics={topics}
            value={field.value?.toString()}
            onChange={(val) => field.onChange(Number(val))}
          />
        )}
      </FormField>

      {/* Description */}
      <FormField
        name="description"
        label="Abstract / Summary"
        helperText="Summarize your paper (10–500 characters). Structure: Introduction, Methods, Results, Conclusion."
        required
      >
        {(field, fieldState) => (
          <div className="relative">
            <Textarea
              {...field}
              rows={6}
              placeholder="Provide a structured summary of your paper..."
              className="resize-none"
            />
            <p
              className={`text-xs mt-1 text-right ${
                (field.value?.length ?? 0) > 500 ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              {field.value?.length ?? 0} / 500
            </p>
          </div>
        )}
      </FormField>

      {/* Keywords — dynamic array */}
      <KeywordsField />

      {/* Files */}
      <FormField
        name="files"
        label="Supporting Files"
        helperText="Optional. Accepted formats: PDF, DOC, DOCX. Attach your full paper or supporting materials."
      >
        {(field) => <FileUploader files={field?.value ?? []} onChange={field.onChange} />}
      </FormField>

      <Field className="border-t pt-6">
        <Button type="submit" className="w-full md:w-auto" disabled={isPending}>
          {isPending && <Spinner />}
          Submit Abstract
        </Button>
      </Field>
    </Form>
  )
}

/** Inline sub-component for the dynamic keywords array field */
function KeywordsField() {
  return (
    <FormField
      name="keywords"
      label="Keywords"
      helperText="Add up to 5 keywords to help index your paper."
    >
      {(field) => {
        const keywords: string[] = field.value ?? []
        const canAdd = keywords.length < 5

        const addKeyword = () => {
          if (canAdd) field.onChange([...keywords, ''])
        }

        const updateKeyword = (index: number, value: string) => {
          const updated = [...keywords]
          updated[index] = value
          field.onChange(updated)
        }

        const removeKeyword = (index: number) => {
          field.onChange(keywords.filter((_, i) => i !== index))
        }

        return (
          <div className="flex flex-col gap-2">
            {keywords.map((kw, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={kw}
                  placeholder={`Keyword ${i + 1}`}
                  onChange={(e) => updateKeyword(i, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => removeKeyword(i)}
                  aria-label="Remove keyword"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}

            {canAdd && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyword}
                className="self-start gap-1.5"
              >
                <Plus className="size-4" />
                Add keyword {keywords.length > 0 && `(${keywords.length}/5)`}
              </Button>
            )}

            {!canAdd && (
              <p className="text-xs text-muted-foreground">Maximum of 5 keywords reached.</p>
            )}
          </div>
        )
      }}
    </FormField>
  )
}
