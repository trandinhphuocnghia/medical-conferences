import {
  Field,
  FieldDescription,
  FieldError as FieldErrorText,
  FieldLabel,
} from '@/components/ui/field'
import { Controller, ControllerFieldState, FieldError, useFormContext } from 'react-hook-form'

interface FieldChildrenProps {
  disabled?: boolean
  error?: FieldError
  invalid?: boolean
  defaultValue?: any
  onChange?: any
  value?: any
}

interface FormFieldProps {
  children?: (field: FieldChildrenProps, fieldState: ControllerFieldState) => React.ReactNode
  label: string
  helperText?: string
  required?: boolean
  hideError?: boolean
  name: string
  disabled?: boolean
}

export default function FormField({
  children,
  label,
  helperText,
  required,
  hideError = false,
  name,
  disabled: fieldDisabled,
}: FormFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState, formState: { defaultValues } }) => (
        <Field data-invalid={fieldState.invalid} className="gap-1">
          <FieldLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </FieldLabel>
          {children &&
            children(
              {
                ...field,
                disabled: fieldDisabled,
                defaultValue: defaultValues?.[name],
                value: field.value,
                onChange: field.onChange,
              },
              fieldState,
            )}
          {helperText && <FieldDescription>{helperText}</FieldDescription>}
          {fieldState.invalid && !hideError && <FieldErrorText errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
