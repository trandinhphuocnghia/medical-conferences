'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import {
  forgotPasswordSchema,
  forgotPasswordSchemaType,
} from '@/schemas/forgot-password.schema'

export async function forgotPassword(data: forgotPasswordSchemaType) {
  try {
    const payload = await getPayload({ config: configPromise })
    const parsed = forgotPasswordSchema.parse(data)

    await payload.forgotPassword({
      collection: 'users',
      data: {
        email: parsed.email,
      },
    })

    return { success: true }
  } catch (error) {
    console.log('Forgot password error', error)
    return { success: false, error }
  }
}
