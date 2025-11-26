import { postgresAdapter } from '@payloadcms/db-postgres'

import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { defaultLexical } from '@/fields/defaultLexical'
import { Abstracts } from './collections/Abstracts'
import { Categories } from './collections/Categories'
import { Comments } from './collections/Comments'
import { Files } from './collections/Files'
import { Likes } from './collections/Likes'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Topics } from './collections/Topics'
import { UserGroups } from './collections/UserGroups'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'
import gmailAdapter from './services/emailAdapter'

import 'dotenv/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  routes: {
    admin: '/dashboard',
  },
  admin: {
    avatar: {
      Component: '@/components/UserAvatar',
    },
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '',
      description: 'Medconf',
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [
    Pages,
    Posts,
    Topics,
    Categories,
    Abstracts,
    Users,
    UserGroups,
    Media,
    Files,
    Likes,
    Comments,
  ],
  cors: [
    ...[getServerSideURL()].filter(Boolean),
    process.env.NEXT_PUBLIC_SERVER_URL,
    'https://studio.apollographql.com', // ✅ allow Apollo Sandbox
  ],
  globals: [Header, Footer],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  logger: {
    options: {
      level: 'debug',
    },
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  graphQL: {
    disablePlaygroundInProduction: true,
  },
  email: gmailAdapter,
})
