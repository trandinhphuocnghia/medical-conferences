import { generateReactHelpers } from '@uploadthing/react'
import type { PublicFileRouter } from '@/server/uploadthing'

export const { useUploadThing, uploadFiles } = generateReactHelpers<PublicFileRouter>()
