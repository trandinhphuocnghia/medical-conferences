import { z } from 'zod'

// Form schema that accepts File objects
export const abstractFormSchema = z
  .object({
    files: z
      .array(z.instanceof(File), { message: 'Files cannot be empty.' })
      .min(1, 'Files cannot be empty.'),

    title: z
      .string({ message: 'Title cannot be empty.' })
      .min(1, 'Title cannot be empty.')
      .max(300, 'Title must be at most 300 characters.'),

    topic: z.string({ message: 'Select at least 1 topic.' }).min(1, 'Select at least 1 topic.'),

    otherTopic: z.string().max(150, 'Topic must be at most 150 characters.').optional(),

    description: z
      .string({ message: 'Description cannot be empty.' })
      .min(10, 'Must be at least 10 characters long.')
      .max(500, 'Must be at most 500 characters long.'),

    keywords: z.string().max(50, 'Each keyword must be at most 50 characters.').optional(),
  })
  .refine(
    (data) => {
      if (data.topic === 'other') {
        return !!data.otherTopic && data.otherTopic.trim().length > 0
      }
      return true
    },
    {
      message: 'Please specify your topic.',
      path: ['otherTopic'],
    },
  )

export type AbstractFormSchema = z.infer<typeof abstractFormSchema>
