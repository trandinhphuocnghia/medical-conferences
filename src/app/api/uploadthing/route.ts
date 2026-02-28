import { createRouteHandler } from 'uploadthing/next'
import { publicFileRouter } from '@/server/uploadthing'

/**
 * Mounts the UploadThing router at /api/uploadthing.
 * UploadThing uses this endpoint to:
 *   - Issue pre-signed URLs (GET)
 *   - Fire the onUploadComplete webhook (POST)
 */
export const { GET, POST } = createRouteHandler({
  router: publicFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
})
