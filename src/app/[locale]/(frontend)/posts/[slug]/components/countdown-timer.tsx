'use client'

import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CountdownTime {
    days: number
    hours: number
    minutes: number
    seconds: number
    isExpired: boolean
}

interface CountdownTimerProps {
    /** ISO date string or Date object for the countdown target */
    targetDate: string | Date
    /** Display variant: 'compact' for inline, 'full' for large card */
    variant?: 'compact' | 'full'
}

export function CountdownTimer({ targetDate, variant = 'full' }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<CountdownTime>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
    })

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const calculateTimeLeft = () => {
            const targetTime = new Date(targetDate).getTime()
            const now = new Date().getTime()
            const difference = targetTime - now

            if (difference <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isExpired: true,
                })
                return
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24))
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((difference / 1000 / 60) % 60)
            const seconds = Math.floor((difference / 1000) % 60)

            setTimeLeft({
                days,
                hours,
                minutes,
                seconds,
                isExpired: false,
            })
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    if (!mounted) {
        return null
    }

    if (timeLeft.isExpired) {
        return (
            <div className="text-center py-4 sm:py-6">
                <p className="text-sm sm:text-base font-semibold text-accent">Conference has started!</p>
            </div>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                <span className="text-xs sm:text-sm font-mono text-navy font-semibold">
                    {String(timeLeft.days).padStart(2, '0')}D {String(timeLeft.hours).padStart(2, '0')}H
                    {String(timeLeft.minutes).padStart(2, '0')}M
                </span>
            </div>
        )
    }

    return (
        <section className="bg-background pt-6 sm:pt-10 ">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl sm:rounded-2xl border border-accent/20 px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                    <div className="text-center space-y-6 sm:space-y-8">
                        {/* Title */}
                        <div className="flex items-center justify-center gap-2">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-accent flex-shrink-0" />
                            <p className="font-semibold text-navy text-base sm:text-lg lg:text-xl">
                                Conference Starts In
                            </p>
                        </div>

                        {/* Countdown Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                            {(
                                [
                                    { value: timeLeft.days, label: 'Days' },
                                    { value: timeLeft.hours, label: 'Hours' },
                                    { value: timeLeft.minutes, label: 'Minutes' },
                                    { value: timeLeft.seconds, label: 'Seconds' },
                                ] as const
                            ).map(({ value, label }) => (
                                <div
                                    key={label}
                                    className="bg-white rounded-lg sm:rounded-xl border border-border hover:border-accent/50 transition-colors shadow-sm"
                                >
                                    <div className="aspect-square flex flex-col items-center justify-center p-2 sm:p-3 lg:p-4">
                                        <div className="text-xl sm:text-3xl lg:text-5xl font-bold font-mono text-accent leading-none">
                                            {String(value).padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-medium mt-2 sm:mt-3">
                                            {label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
