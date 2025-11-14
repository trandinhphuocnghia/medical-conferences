'use client'
import React, { useCallback } from 'react'
import { TextFieldClientProps } from 'payload'

import {
  useField,
  Button,
  TextInput,
  FieldLabel,
  useForm,
} from '@payloadcms/ui'

import { formatSlug } from './formatSlug'
import './index.scss'

type SlugComponentProps = {
  fieldToUse: string
  checkboxFieldPath: string
  required?: boolean
} & TextFieldClientProps

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  fieldToUse,
  path,

  required,
}) => {
  const { label } = field

  const { value, setValue } = useField<string>({ path: path || field.name })

  const { getDataByPath } = useForm()

  const handleGenerate = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault()

      const targetFieldValue = getDataByPath(fieldToUse) as string

      if (targetFieldValue) {
        const formattedSlug = formatSlug(targetFieldValue)

        if (value !== formattedSlug) setValue(formattedSlug)
      } else {
        if (value !== '') setValue('')
      }
    },
    [setValue, value, fieldToUse, getDataByPath],
  )

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel
          htmlFor={`field-${path}`}
          label={label}
          required={required}
        />
        <Button
          className="lock-button"
          buttonStyle="none"
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </div>
      <TextInput
        value={value}
        required={required}
        onChange={setValue}
        path={path || field.name}
      />
    </div>
  )
}
