'use client'
import { createAbstract } from '@/app/actions/abstracts/createAbstract'
import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { abstractSchema, AbstractSchema } from '@/schemas/abstract.schema'
import { toastError } from '@/utilities/toast'
import { SelectTopic } from './select-topic'
import { FileUploader } from './upload'

export function CreateAbstractForm() {
  const onSubmit = async (data: AbstractSchema) => {
    try {
      console.log(JSON.stringify({ ...data }))

      const res = await createAbstract(data)

      if (!res.success) {
        toastError(res.error)
      }
    } catch (err) {
      console.log({ err })
    }

    return {}
  }

  return (
    <Form
      mode="all"
      schema={abstractSchema}
      onSubmit={onSubmit}
      className="w-full"
    >
      <FormField name="title" label="Title" required>
        {(field) => <Input {...field} />}
      </FormField>
      <FormField name="topic" label="Topic" required>
        {(field) => (
          <SelectTopic onChange={field?.onChange} value={field?.value} />
        )}
      </FormField>
      <FormField name="description" label="Description" required>
        {(field) => <Input {...field} />}
      </FormField>
      <FormField name="files" label="Files" required>
        {(field) => (
          <FileUploader files={field?.value} onChange={field.onChange} />
        )}
      </FormField>

      <Field>
        <Button type="submit">Submit</Button>
      </Field>
    </Form>
  )
}
