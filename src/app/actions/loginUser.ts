'use server'

import { signinSchema, signinSchemaType } from '@/schemas/signin.schema'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

export async function loginUser(data: signinSchemaType) {
  try {
    const payload = await getPayload({ config: configPromise })
    const parsed = signinSchema.parse(data)

    const result = await payload.login({
      collection: 'users',
      data: {
        email: parsed.email,
        password: parsed.password,
      },
    })

    // Set the authentication cookie explicitly
    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      })
    }

    return { success: true, user: result.user }
  } catch (error) {
    console.log('Login error', error)
    return { success: false, error }
  }
}
