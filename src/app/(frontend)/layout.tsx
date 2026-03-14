import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { UserStoreInitializer } from '@/components/UserStoreInitializer'
import { getCurrentUser } from '@/hooks/getCurrentUser'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <UserStoreInitializer user={user} />
          <Header />
          <Toaster />
          <main className="flex-1 pt-16">
            <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: 'HIGCF',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}
