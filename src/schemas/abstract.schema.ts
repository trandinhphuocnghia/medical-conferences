import { z } from 'zod'

export const abstractFormSchema = z.object({
  title: z.string({ message: 'Title cannot be empty.' }).min(1, 'Title cannot be empty.'),

  conference: z.number({ message: 'Conference is required.' }),

  topic: z.number({ message: 'Please select a topic.' }),

  description: z
    .string({ message: 'Description cannot be empty.' })
    .min(10, 'Must be at least 10 characters long.')
    .max(500, 'Must be at maximum 500 characters long.'),

  keywords: z.array(z.string().min(1, 'Keyword cannot be empty.')).max(5, 'You can add up to 5 keywords.'),

  files: z.array(z.instanceof(File)),
})

export type AbstractFormSchema = z.infer<typeof abstractFormSchema>
