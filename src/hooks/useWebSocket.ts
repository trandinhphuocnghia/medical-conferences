import { useEffect, useRef, useState } from 'react'

/**
 * WebSocket configuration constants
 */
export const WS_CONFIG = {
  URL: 'ws://localhost:8081',
  MAX_RETRIES: 5,
  RETRY_DELAY: 2000, // 2 seconds
} as const

/**
 * Message types for WebSocket communication
 */
export const MESSAGE_TYPES = {
  FETCH_COLLECTION: 'FETCH_COLLECTION',
  COLLECTION_DATA: 'COLLECTION_DATA',
  COLLECTION_CHANGED: 'COLLECTION_CHANGED',
} as const

/**
 * Connection status messages
 */
export const CONNECTION_STATUS = {
  CONNECTING: 'Connecting...',
  CONNECTED: 'Connected',
  DISCONNECTED: 'Disconnected',
  FAILED: 'Failed to connect',
  ERROR: 'Error',
} as const

/**
 * Represents a WebSocket message structure for real-time updates
 */
export type WSMessage<T> = {
  type: string
  collection: string
  operation: 'create' | 'update' | 'delete'
  doc: T
}

export type ConnectionStatus =
  (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS]
type UseWebSocketProps<T> = {
  collection: string
  onMessage: (data: T) => void
}

export function useWebSocket<T>({
  collection,
  onMessage,
}: UseWebSocketProps<T>) {
  const [status, setStatus] = useState<ConnectionStatus>(
    CONNECTION_STATUS.CONNECTING,
  )
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let retryCount = 0

    const connectWebSocket = async () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return

      try {
        // Initialize Payload if needed
        // await initPayload() <- TODO: CHECK THIS.

        wsRef.current = new WebSocket(WS_CONFIG.URL)

        wsRef.current.onopen = () => {
          setStatus(CONNECTION_STATUS.CONNECTED)
          retryCount = 0
          wsRef.current?.send(
            JSON.stringify({
              type: 'TOUCHING',
              collection,
            }),
          )
        }

        wsRef.current.onmessage = (event) => {
          const message = JSON.parse(event.data)
          onMessage(message)
        }

        wsRef.current.onclose = () => {
          setStatus(CONNECTION_STATUS.DISCONNECTED)

          if (retryCount < WS_CONFIG.MAX_RETRIES) {
            retryCount++
            setTimeout(connectWebSocket, WS_CONFIG.RETRY_DELAY)
          } else {
            setStatus(CONNECTION_STATUS.FAILED)
          }
        }
      } catch (error) {
        console.error('WebSocket error:', error)
        setStatus(CONNECTION_STATUS.ERROR)
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [collection, onMessage])

  return { connectStatus: status }
}
