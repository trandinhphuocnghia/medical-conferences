'use client'

import { registerUser } from '@/app/actions/registerUser'
import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { signupSchema, signupSchemaType } from '@/schemas/signup.schema'
import { toastError, toastSuccess } from '@/utilities/toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRegisterUser = async (data: signupSchemaType) => {
    startTransition(async () => {
      const res = await registerUser(data)
      if (res.success) {
        toastSuccess({
          message: 'Account created successfully! Please check your email to verify your account.',
        })
        setTimeout(() => {
          router.push('/dashboard/login')
        }, 3000)
      } else {
        toastError({
          message: (res?.error as Error)?.message || 'Failed to create account.',
        })
      }
    })

    return {}
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form mode="all" schema={signupSchema} onSubmit={handleRegisterUser} className="w-full">
          <FormField name="firstName" label="First Name" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="lastName" label="Last Name" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="email" label="Email" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="password" label="Password" required>
            {(field) => <PasswordInput {...field} />}
          </FormField>
          <FormField name="confirmPassword" label="Confirm Password" required>
            {(field) => <PasswordInput {...field} />}
          </FormField>
          <FieldGroup>
            <Field>
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending && <Spinner />} Create Account
              </Button>
              <Separator className="my-4" />
              <FieldDescription className="px-6 text-center">
                Already have an account? <Link href="/dashboard/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  )
}
