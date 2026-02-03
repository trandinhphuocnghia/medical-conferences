'use client'

import { loginUser } from '@/app/actions/loginUser'
import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { signinSchema, signinSchemaType } from '@/schemas/signin.schema'
import { toastError, toastSuccess } from '@/utilities/toast'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function SigninForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (data: signinSchemaType) => {
    startTransition(async () => {
      const res = await loginUser(data)
      if (res.success) {
        toastSuccess({
          message: 'Login successfully!',
        })
        const redirect = searchParams.get('redirect') || '/dashboard'
        router.push(redirect)
      } else {
        toastError({
          message: (res?.error as Error)?.message || 'Failed to login.',
        })
      }
    })

    return {}
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login to HIGF</CardTitle>
        <CardDescription>Enter your information below to signin your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form mode="all" schema={signinSchema} onSubmit={handleLogin} className="w-full">
          <FormField name="email" label="Email" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="password" label="Password" required>
            {(field) => <PasswordInput {...field} />}
          </FormField>
          <FieldGroup>
            <Field>
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending && <Spinner />} Login
              </Button>
              <Separator className="my-4" />
              <FieldDescription className="px-6 text-center">
                {"Don't"} have an account? <Link href="/signup">Sign up</Link>
              </FieldDescription>
              <FieldDescription className="px-6 text-center">
                Forgot Password? <Link href="/forgot-password">Forgot Password</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  )
}
