'use client'
import { createAbstract } from '@/app/actions/abstracts/createAbstract'
import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Topic } from '@/payload-types'
import { abstractSchema, AbstractSchema } from '@/schemas/abstract.schema'
import { toastError } from '@/utilities/toast'
import { SelectTopic } from './select-topic'
import { FileUploader } from './upload'

interface Props {
  topics: Topic[]
}
export function CreateAbstractForm({ topics }: Props) {
  const onSubmit = async (data: AbstractSchema) => {
    try {
      const res = await createAbstract(data)

      if (!res.success) {
        toastError(res?.error)
      }
    } catch {}

    return {}
  }

  return (
    <Form
      mode="all"
      schema={abstractSchema}
      onSubmit={onSubmit}
      className="w-full "
    >
      <FormField name="title" label="Title of your paper" required>
        {(field) => <Input {...field} />}
      </FormField>
      <FormField name="topic" label="Topic" required>
        {(field) => (
          <SelectTopic
            topics={topics}
            onChange={field?.onChange}
            value={field?.value}
          />
        )}
      </FormField>
      <FormField
        name="description"
        helperText="Summarize your paper in 50 words or less. Note: This summary will appear in the conference program."
        label="Summary of your paper"
        required
      >
        {(field) => <Textarea {...field} />}
      </FormField>
      <FormField
        name="files"
        label="Files"
        helperText="File upload supports pdf, doc, docx, txt, & rtf formats. lf you choose to submit your abstract in file format, please include your name, title, summary and full abstract in the file."
        required
      >
        {(field) => (
          <FileUploader files={field?.value} onChange={field.onChange} />
        )}
      </FormField>

      <Field className="border-t py-8">
        <Button className="md:w-full m-auto" type="submit">
          Submit
        </Button>
      </Field>
    </Form>
  )
}
