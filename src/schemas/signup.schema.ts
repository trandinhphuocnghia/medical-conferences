import * as z from 'zod'

export const signupSchema = z
  .object({
    firstName: z
      .string({
        message: 'First Name is required',
      })
      .nonempty({
        message: 'First is required',
      }),
      lastName: z
      .string({
        message: 'Last Name is required',
      })
      .nonempty({
        message: 'Last Name is required',
      }),
    email: z
      .string({
        message: 'Email is required',
      })
      .nonempty({
        message: 'Email is required',
      })
      .email({
        message: 'Invalid Email',
      }),
    password: z
      .string({
        message: 'Password is required',
      })
      .min(8, { message: 'Must be at least 8 characters long' })
      .max(30, { message: 'Must be at most 30 characters long' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Must contain at least one uppercase letter',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Must contain at least one lowercase letter',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Must contain at least one number',
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: 'Must contain at least one special character',
      }),
    confirmPassword: z.string({
      message: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password do not match',
    path: ['confirmPassword'],
  })

export type signupSchemaType = z.infer<typeof signupSchema>
