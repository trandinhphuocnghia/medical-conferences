'use client'

import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { signupSchema, signupSchemaType } from '@/schemas/signup.schema'
import Link from 'next/link'

export async function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const handleRegisterUser = async (_data: signupSchemaType) => {
    return { success: true, data: undefined }
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
            {(field) => <Input {...field} type="password" />}
          </FormField>
          <FormField name="confirmPassword" label="Confirm Password" required>
            {(field) => <Input {...field} type="password" />}
          </FormField>
          <FieldGroup>
            <Field>
              <Button type="submit" variant="outline">
                Create Account
              </Button>
              <Separator className="my-4" />
              <FieldDescription className="px-6 text-center">
                Already have an account? <Link href="/admin/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  )
}
