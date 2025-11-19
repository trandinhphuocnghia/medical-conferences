import { z } from 'zod'

export const abstractSchema = z.object({
  files: z
    .array(
      z.object({
        url: z
          .string({ message: 'URL cannot be empty.' })
          .min(1, 'URL cannot be empty.'),
      }),
      { message: 'Files cannot be empty.' },
    )
    .min(1, 'Files cannot be empty.'),

  title: z
    .string({ message: 'Title cannot be empty.' })
    .min(1, 'Title cannot be empty.'),

  topic: z
    .string({ message: 'Select at lease 1 topic.' })
    .min(1, 'Select at lease 1 topic.'),

  description: z
    .string({ message: 'Description cannot be empty.' })
    .min(10, 'Must be at least 10 characters long.')
    .max(50, 'Must be at maximum 50 characters long.'),

  keywords: z.string().optional(),
})

// A Zod type representing the structure of an Abstract document
export type AbstractSchema = z.infer<typeof abstractSchema>
