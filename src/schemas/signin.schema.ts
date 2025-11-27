import * as z from 'zod'

export const signinSchema = z.object({
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
    .nonempty({
      message: 'Password is required',
    }),
})

export type signinSchemaType = z.infer<typeof signinSchema>
