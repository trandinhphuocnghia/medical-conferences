'use client'

import { useTransition } from 'react'
import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { toastError, toastSuccess } from '@/utilities/toast'
import { useRouter } from 'next/navigation'
import { forgotPasswordSchema, forgotPasswordSchemaType } from '@/schemas/forgot-password.schema'
import { forgotPassword } from '@/app/actions/forgot-password'

export function ForgotPasswordForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleForgotPassword = async (data: forgotPasswordSchemaType) => {
    startTransition(async () => {
      const res = await forgotPassword(data)
      if (res.success) {
        toastSuccess({
          message: 'Check your email for reset password instructions',
        })
        router.push('/signin')
      } else {
        toastError({
          message: (res?.error as Error)?.message || 'Failed to reset password.',
        })
      }
    })

    return {}
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          mode="all"
          schema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}
          className="w-full"
        >
          <FormField name="email" label="Email" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FieldGroup>
            <Field>
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending && <Spinner />} Submit
              </Button>
              <Separator className="my-4" />
              <FieldDescription className="px-6 text-center">
                Back to <Link href="/signin">Login</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  )
}
