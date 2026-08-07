import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { Inter, JetBrains_Mono } from 'next/font/google'
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
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Statically propagate the locale to next-intl for Server Components
  setRequestLocale(locale)

  const user = await getCurrentUser()
  const messages = await getMessages()

  return (
    <html className={cn(inter.variable, jetbrainsMono.variable)} lang={locale} suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider key={locale} messages={messages}>
          <Providers>
            <UserStoreInitializer user={user} />
            <Header />
            <Toaster />
            <main className="flex-1 pt-16">
              <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
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
