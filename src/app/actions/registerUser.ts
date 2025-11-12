'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { signupSchema, signupSchemaType } from '@/schemas/signup.schema'

export async function registerUser(data: signupSchemaType) {
  const payload = await getPayload({ config: configPromise })
  const parsed = signupSchema.parse(data)

  // Confirm passwords match
  if (parsed.password !== parsed.confirmPassword) {
    throw new Error("Passwords don't match")
  }

  // Check if user already exists
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: parsed.email } },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    throw new Error('A user with this email already exists')
  }

  // Create user in PayloadCMS
  const user = await payload.create({
    collection: 'users',
    data: {     
      email: parsed.email,
      password: parsed.password, // Payload automatically hashes it
      roles: ['user'], // default role
      first_name: parsed.firstName,
      last_name:parsed.lastName,
    },
  })

  return { success: true, user }
}
