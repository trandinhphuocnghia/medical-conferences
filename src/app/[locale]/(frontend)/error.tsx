'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Unhandled frontend error:', error)
    }, [error])

    return (
        <div className="container py-28">
            <div className="prose max-w-none">
                <h1 style={{ marginBottom: 0 }}>Something went wrong</h1>
                <p className="mb-4">
                    An unexpected error occurred. Please try again or go back to the homepage.
                </p>
            </div>
            <div className="flex gap-3 mt-4">
                <Button onClick={reset} variant="outline">
                    Try again
                </Button>
                <Button asChild variant="default">
                    <Link href="/">Go home</Link>
                </Button>
            </div>
        </div>
    )
}
