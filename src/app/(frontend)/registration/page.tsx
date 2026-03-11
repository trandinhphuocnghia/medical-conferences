import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RegistrationForm } from './components/RegistrationForm'

export const metadata: Metadata = {
  title: 'Conference Registration | HIGCF',
  description: 'Register for upcoming HIGCF conferences.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        }
      >
        <RegistrationForm />
      </Suspense>
    </div>
  )
}
