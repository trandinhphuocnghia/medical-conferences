'use client'

import { Button } from '@/components/ui/button'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Seat } from '@/payload-types'
import { cn } from '@/utilities/utils'

interface Props {
  seats: Seat[]
}

const SEAT_STYLES = {
  VIP: { bg: '#EFBF04', text: 'black' },
  MIDDLE: { bg: '#2D68C4', text: 'white' },
  FREE: { bg: '#6D8196', text: 'white' },
}

export const Seats = ({ seats = [] }: Props) => {
  const { connectStatus } = useWebSocket({
    collection: 'reservations',
    onMessage: () => {},
  })

  return (
    <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
      {seats.map((seat) => {
        const isAvailable = seat.status === 'AVAILABLE'
        const isSold = seat.status === 'SOLD'

        if (!seat?.type) return null

        return (
          <Button
            key={seat.id}
            disabled={!isAvailable}
            style={{
              backgroundColor: isAvailable
                ? SEAT_STYLES[seat.type].bg
                : '#e2e8f0',
              color: SEAT_STYLES[seat.type].text,
            }}
            className={cn(
              'h-12 w-full transition-transform cursor-pointer active:scale-95 hover:opacity-80',
              !isAvailable && 'opacity-50 cursor-not-allowed grayscale',
            )}
          >
            <div className="flex flex-col text-[10px]">
              <span className="font-bold text-sm">{seat.label}</span>
              <span>{isSold ? 'SOLD' : seat.type}</span>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
