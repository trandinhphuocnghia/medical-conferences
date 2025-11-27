import { z } from 'zod'

// Form schema that accepts File objects
export const abstractFormSchema = z.object({
  files: z
    .array(z.instanceof(File), { message: 'Files cannot be empty.' })
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

export type AbstractFormSchema = z.infer<typeof abstractFormSchema>
