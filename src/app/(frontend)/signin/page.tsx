import { Suspense } from 'react'
import { SigninForm } from './components/signin-form'
import { Spinner } from '@/components/ui/spinner'

export default function Page() {
  return (
    <div className="flex w-full min-h-[calc(100vh-200px)] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="flex justify-center p-10">
              <Spinner className="size-8 text-muted-foreground" />
            </div>
          }
        >
          <SigninForm className="shadow-xl bg-white border-none" />
        </Suspense>
      </div>
    </div>
  )
}
