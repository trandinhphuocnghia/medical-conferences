// app/(frontend)/send-email/page.tsx
'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { sendTestEmail } from '@/app/actions/sendEmail'

export default function SendEmailButton() {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const res = await sendTestEmail()
      if (res.success) alert('✅ Email sent successfully!')
      else alert('❌ Failed: ' + res.error)
    })
  }

  return (
    <Button disabled={isPending} onClick={handleClick}>
      {isPending ? 'Sending...' : 'Send test email'}
    </Button>
  )
}
