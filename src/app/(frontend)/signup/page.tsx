import { SignupForm } from './signup-form'
export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignupForm className="shadow-xl bg-white border-none" />
      </div>
    </div>
  )
}
