import { SigninForm } from './components/signin-form'

export default function Page() {
  return (
    <div className="flex w-full min-h-[calc(100vh-200px)] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SigninForm className="shadow-xl bg-white border-none" />
      </div>
    </div>
  )
}
