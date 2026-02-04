'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Reservation, Seat } from '@/payload-types'
import { CONNECTION_STATUS, MESSAGE_TYPES, WSMessage } from '@/types'
import { cn } from '@/utilities/utils'
import { useCallback } from 'react'

interface Props {
  seats: Seat[]
  token: string | null
}

const SEAT_STYLES = {
  VIP: { bg: '#EFBF04', text: 'black' },
  MIDDLE: { bg: '#2D68C4', text: 'white' },
  FREE: { bg: '#6D8196', text: 'white' },
}

export const Seats = ({ seats = [], token }: Props) => {
  const handleMessage = useCallback((message: WSMessage<Reservation>) => {
    switch (message.type) {
      case MESSAGE_TYPES.CLIENT_LIST_UPDATE:
        break
      case MESSAGE_TYPES.COLLECTION_DATA:
        break
      case MESSAGE_TYPES.COLLECTION_CHANGED:
        if (message.collection === 'reservations') {
          switch (message.operation) {
            case 'create':
              // setTodos((prev) => [...prev, message.doc])
              break
            case 'update':
              //   setTodos((prev) =>
              //     prev.map((todo) =>
              //       todo.id === message.doc.id ? message.doc : todo,
              //     ),
              //   )
              break
            case 'delete':
              //   setTodos((prev) =>
              //    prev.filter((todo) => todo.id !== message.doc.id),
              //   )
              break
          }
        }
        break
    }
  }, [])

  const { connectStatus } = useWebSocket({
    collection: 'reservations',
    onMessage: handleMessage,
    token,
  })

  return (
    <>
      <Alert
        size="sm"
        className="w-2 aspect-square rounded-full"
        variant={connectStatus === CONNECTION_STATUS.CONNECTED ? 'success' : 'warning'}
      />
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
                backgroundColor: isAvailable ? SEAT_STYLES[seat.type].bg : '#e2e8f0',
                color: SEAT_STYLES[seat.type].text,
              }}
              className={cn(
                'h-12 w-full transition-transform cursor-pointer active:scale-95 hover:opacity-80',
                {
                  'opacity-50 cursor-not-allowed grayscale': !isAvailable,
                },
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
    </>
  )
}
