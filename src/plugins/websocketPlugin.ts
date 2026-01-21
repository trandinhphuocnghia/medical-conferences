import { MESSAGE_TYPES } from '@/types'
import { jwtVerify } from 'jose'
import type { Config } from 'payload'
import { CollectionSlug } from 'payload'
import { parse } from 'url'
import ws, { WebSocketServer } from 'ws'

/**
 * Configuration options for the WebSocket plugin
 */
interface PluginTypes {
  /** Port number for the WebSocket server. Defaults to 8081 */
  port?: number
  /** Array of collection slugs to watch for changes */
  collections?: string[]
}

/** Global WebSocket server instance */
let wss: WebSocketServer
const clients = new Map() // Key: userId, Value: WebSocket object

/**
 * Payload CMS plugin that adds real-time functionality through WebSockets
 *
 * @param pluginOptions - Configuration options for the WebSocket server
 * @returns A Payload plugin that sets up WebSocket server and collection hooks
 *
 * @example
 * ```typescript
 * // In payload.config.ts
 * export default buildConfig({
 *   plugins: [
 *     websocketServerPlugin({
 *       collections: ['todos'],
 *       port: 8081
 *     })
 *   ]
 * })
 * ```
 */
export const websocketServerPlugin =
  (pluginOptions: PluginTypes = {}) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    if (pluginOptions.collections) {
      config.collections = (config.collections || []).map((collection) => {
        if (!pluginOptions.collections?.includes(collection.slug))
          return collection

        return {
          ...collection,
          hooks: {
            ...collection.hooks,
            /**
             * Hook that runs after a document is deleted
             * Broadcasts the deletion to all connected WebSocket clients
             */
            afterDelete: [
              async ({ doc }) => {
                if (wss) {
                  const message = JSON.stringify({
                    type: MESSAGE_TYPES.COLLECTION_CHANGED,
                    collection: collection.slug,
                    operation: 'delete',
                    doc,
                  })
                  wss.clients.forEach((client) => {
                    if (client.readyState === ws.OPEN) {
                      client.send(message)
                    }
                  })
                }
              },
            ],
            /**
             * Hook that runs after a document is changed (created/updated)
             * Broadcasts the change to all connected WebSocket clients
             */
            afterChange: [
              async ({ doc, operation, req }) => {
                if (wss) {
                  const populatedDoc = await req.payload.find({
                    collection: collection.slug as CollectionSlug,
                    where: {
                      id: { equals: doc.id },
                    },
                    depth: 2,
                  })

                  const message = JSON.stringify({
                    type: MESSAGE_TYPES.COLLECTION_CHANGED,
                    collection: collection.slug,
                    operation,
                    doc: populatedDoc.docs[0],
                  })

                  wss.clients.forEach((client) => {
                    if (client.readyState === ws.OPEN) {
                      client.send(message)
                    }
                  })
                }
                return doc
              },
            ],
          },
        }
      })
    }

    /**
     * Initializes the WebSocket server when Payload starts
     * Sets up message handling for collection data requests
     */
    config.onInit = async (payload) => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)

      wss = new WebSocketServer({
        port: pluginOptions.port || 8081,

        //authentication
        verifyClient: async (info, callback) => {
          try {
            const { query } = parse(info.req.url || '', true)
            const token = query.token as string

            if (!token) {
              return callback(false, 401, 'Unauthorized')
            }

            // Verify the token against Payload's secret
            const secret = new TextEncoder().encode(payload.secret)
            const { payload: user } = await jwtVerify(token, secret)

            if (!user) {
              console.log('ERROR:', { user })
              return callback(false, 401, 'Invalid Token')
            }

            callback(true) // User is authenticated!
          } catch (err) {
            callback(false, 401, 'Forbidden')
          }
        },
      })

      wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message.toString())

            switch (data.type) {
              case MESSAGE_TYPES.TOUCHING:
                //send to client:
                ws.send(
                  JSON.stringify({ type: MESSAGE_TYPES.TOUCHING, data: [] }),
                )

                const secret = new TextEncoder().encode(payload.secret)
                const { payload: user } = await jwtVerify(data.token, secret)

                //broadcast to all clients:
                wss.clients.forEach((client) => {
                  console.log({ client })
                  if (client.readyState === ws.OPEN) {
                    client.send(
                      JSON.stringify({
                        type: MESSAGE_TYPES.CLIENT_LIST_UPDATE,
                        data: [],
                      }),
                    )
                  }
                })

                ws.send(
                  JSON.stringify({ type: MESSAGE_TYPES.TOUCHING, data: [] }),
                )
                break
            }
          } catch (error) {
            console.error('WebSocket error:', error)
          }
        })
      })
    }

    return config
  }
