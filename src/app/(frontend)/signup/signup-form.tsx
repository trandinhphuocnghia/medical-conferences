'use client'

import Form from '@/components/common/form'
import FormField from '@/components/common/form-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
})

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form mode="all" schema={formSchema} className="w-full">
          <FormField name="name" label="Full Name" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="email" label="Email" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="password" label="Password" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="confirmPassword" label="Confirm Password" required>
            {(field) => <Input {...field} />}
          </FormField>
          <FieldGroup>
            <Field>
              <Button type="submit">Create Account</Button>
              <Button variant="outline" type="button">
                Sign up with Google
              </Button>
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
