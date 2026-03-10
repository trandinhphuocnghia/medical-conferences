'use server'

import { signupSchema, signupSchemaType } from '@/schemas/signup.schema'
import configPromise from '@payload-config'
import { getPayload, User } from 'payload'

export async function registerUser(data: signupSchemaType) {
  try {
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

    //TODO: Register flow
    // const user = await payload.create({
    //   collection: 'users',
    //   data: {
    //     email: parsed.email,
    //     password: parsed.password, // Payload automatically hashes it

    //     firstName: parsed.firstName,
    //     lastName: parsed.lastName,
    //   },
    // })
    return { success: true, user: {} as User }
  } catch (error) {
    console.log('Signup error', error)
    return { success: false, error }
  }
}
