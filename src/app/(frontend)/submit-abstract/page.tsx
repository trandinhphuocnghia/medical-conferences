import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AbstractSubmitForm } from './components/AbstractSubmitForm'

export const metadata: Metadata = {
  title: 'Submit Abstract | MedConf',
  description: 'Submit your scientific abstract for review at MedConf conferences.',
}

export default function SubmitAbstractPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        }
      >
        <AbstractSubmitForm />
      </Suspense>
    </div>
  )
}
