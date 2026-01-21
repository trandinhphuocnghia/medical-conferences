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
  TOUCHING: 'TOUCHING',
  CLIENT_LIST_UPDATE: 'CLIENT_LIST_UPDATE',
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

export type UseWebSocketProps<T> = {
  collection: string
  onMessage: (data: T) => void
  token: string | null
}
