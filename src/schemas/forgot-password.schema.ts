import * as z from 'zod'

export const forgotPasswordSchema = z.object({
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
})

export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>
