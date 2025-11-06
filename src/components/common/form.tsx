'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, FormProvider, useForm, UseFormProps, UseFormReturn } from 'react-hook-form'
import { ZodType } from 'zod'
import { FieldGroup } from '../ui/field'

interface DefaultErrorResponse {
  message: string
  code: string
}

export interface FetcherResponse<K> {
  error?: DefaultErrorResponse
  data?: K
  success?: boolean
}

interface XFormProps<T extends FieldValues, K> {
  schema?: ZodType<T>
  disabled?: boolean
  children: React.ReactNode
  onSubmit?: (data: T) => Promise<FetcherResponse<K>>
  onBeforeSubmit?: (data: T) => Promise<{
    valueHasChanged: boolean
  }> | void
  onError?: (error: DefaultErrorResponse) => void
  onSuccess?: (response: FetcherResponse<K>) => void
  defaultValues?: UseFormProps<T>['defaultValues']
  ref?: React.RefObject<UseFormReturn<T> | null>
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLFormElement>) => void
  headerErrorMessages?: Record<string, string>
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all' | undefined
  formId?: string
}

const Form = <T extends FieldValues, K>({
  onSubmit,
  onBeforeSubmit,
  onError,
  onSuccess,
  children,
  schema,
  defaultValues,
  className,
  onKeyDown,
  mode = 'onBlur',
  formId,
}: XFormProps<T, K>) => {
  const methods = useForm<T>({
    mode,
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  })

  const handleSubmitForm = methods.handleSubmit(async (data: T) => {
    if (onBeforeSubmit) {
      await onBeforeSubmit(data)
    }
    try {
      const response = await onSubmit?.(data)

      if (response?.error) {
        onError?.(response.error)
      }
      if (typeof onSuccess === 'function' && response?.success) {
        onSuccess(response)
      }
    } catch (error) {
      onError?.(error as DefaultErrorResponse)
    }
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    onKeyDown?.(e)
  }

  return (
    <FormProvider {...methods}>
      <form
        id={formId}
        onSubmit={handleSubmitForm}
        noValidate
        className={className}
        onKeyDown={handleKeyDown}
      >
        <FieldGroup>{children}</FieldGroup>
      </form>
    </FormProvider>
  )
}

export default Form
