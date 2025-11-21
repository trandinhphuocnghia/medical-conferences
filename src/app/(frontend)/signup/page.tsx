import { getMeUser } from '@/utilities/getMeUser'
import { SignupForm } from './signup-form'
import { redirect } from 'next/navigation'
export default async function Page() {
  const { user } = await getMeUser()

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
