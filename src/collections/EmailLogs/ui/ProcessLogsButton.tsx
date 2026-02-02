'use client'

import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const ProcessLogsButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleProcess = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cron/email', {
        method: 'GET',
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to process logs`)
      }

      const data = await res.json()
      toast.success(
        `Processed: ${data.processed}, Succeeded: ${data.succeeded}, Failed: ${data.failed}`,
      )
      router.refresh()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error processing logs'
      toast.error(msg)
      console.error('Email processing error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <p>Click the button to process pending and failed emails (3 times)</p>
      <Button onClick={handleProcess} disabled={loading}>
        {loading ? 'Processing...' : 'Process Pending Emails'}
      </Button>
    </div>
  )
}
