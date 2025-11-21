'use client'

import { SignupForm } from './signup-form'
import { redirect } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
export default function Page() {
  const { user } = useAuth()

  if (user) {
    redirect('/admin/account')
  }

  return (
    <div className="flex w-full h-[calc(100vh-200px)] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignupForm className="shadow-xl bg-white border-none" />
      </div>
    </div>
  )
}
