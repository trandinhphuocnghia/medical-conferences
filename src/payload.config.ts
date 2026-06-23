import { postgresAdapter } from '@payloadcms/db-postgres'

import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { defaultLexical } from '@/fields/defaultLexical'
import { Abstracts } from './collections/Abstracts'
import { Categories } from './collections/Categories'
import { Comments } from './collections/Comments'
import { Courses } from './collections/Courses'
import { MailLogs } from './collections/EmailLogs'
import { Files } from './collections/Files'
import { Likes } from './collections/Likes'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { PublicFiles } from './collections/PublicFiles'
import { Registrations } from './collections/Registrations'
import { Reservations } from './collections/Reservations'
import { Rooms } from './collections/Rooms'
import { Seats } from './collections/Seats'
import { Sponsors } from './collections/Sponsors'
import { Topics } from './collections/Topics'
import { UserGroups } from './collections/UserGroups'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'

import 'dotenv/config'
import resendAdapter from './services/email/resendAdapter'

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
      beforeNavLinks: ['@/components/BackToFrontend'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '',
      description: 'HIGCF',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon-32x32.png',
        },
        {
          rel: 'apple-touch-icon',
          url: '/apple-touch-icon.png',
        },
      ],
      openGraph: {
        siteName: 'HIGCF',
        description: 'HIGCF',
        type: 'website',
        images: [
          {
            url: '/thumbnail.jpg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@HIGCF',
        title: 'HIGCF',
        description: 'HIGCF',
      },
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
      max: 3, // keep low — each serverless instance gets its own pool; Neon pooler fans out
      idleTimeoutMillis: 20_000, // close idle connections after 20s (Neon suspends at 30s)
      connectionTimeoutMillis: 10_000, // fail fast on cold starts instead of hanging
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
    PublicFiles,
    Registrations,
    Likes,
    Comments,
    Rooms,
    Seats,
    Reservations,
    Sponsors,
    Courses,
    MailLogs,
  ],
  cors: [
    ...[getServerSideURL()].filter(Boolean),
    process.env.NEXT_PUBLIC_SERVER_URL,
    'https://www.higcf.org',
    'https://higcf.org',
    'https://studio.apollographql.com', // ✅ allow Apollo Sandbox
  ],
  globals: [Header, Footer],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
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
  email: resendAdapter,
})
