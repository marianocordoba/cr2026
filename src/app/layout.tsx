import type { Metadata, Viewport } from 'next'

import { Outfit } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { env } from '@/env'
import '@/styles/globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

const SITE_NAME = 'Grilla Cosquín Rock 2026'
const SITE_DESCRIPTION =
  '¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio cronograma de shows!'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [{ sizes: '180x180', url: '/icons/apple-touch-icon-180x180.png' }],
    shortcut: '/favicon.ico',
  },
  keywords: [
    'cosquín rock',
    'cosquín rock 2026',
    'grilla cosquín rock',
    'grilla cosquín rock 2026',
    'cronograma cosquín rock',
    'horarios cosquín rock',
    'lineup cosquín rock 2026',
    'festival rock argentina',
    'festival cosquín',
    'artistas cosquín rock',
    'escenarios cosquín rock',
    'febrero 2026',
    '14 y 15 de febrero',
  ],
  manifest: '/manifest.webmanifest',
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  openGraph: {
    description: SITE_DESCRIPTION,
    locale: 'es_AR',
    siteName: SITE_NAME,
    title: SITE_NAME,
    type: 'website',
    url: env.NEXT_PUBLIC_BASE_URL,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  twitter: {
    card: 'summary_large_image',
    description: SITE_DESCRIPTION,
    title: SITE_NAME,
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: '#09090b',
  width: 'device-width',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
