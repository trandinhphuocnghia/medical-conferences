import { z } from 'zod'

// Define the core schema for the 'Abstracts' collection
export const abstractSchema = z.object({
  // conference: z.string().nullish(), //for submit

  files: z.array(
    z.object({
      url: z.string().min(1, 'URL cannot be empty.'),
    }),
  ),

  title: z.string().min(1, 'Title cannot be empty.'),

  topic: z.string().min(1, 'Select at lease 1 topic.'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),

  keywords: z.string().optional(),
})

// A Zod type representing the structure of an Abstract document
export type AbstractSchema = z.infer<typeof abstractSchema>
