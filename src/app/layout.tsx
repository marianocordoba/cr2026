import type { Metadata, Viewport } from 'next'

import { Outfit } from 'next/font/google'

import { env } from '@/env'
import '@/styles/globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Grilla Cosquín Rock 2026',
  description:
    '¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio cronograma de shows!',
  keywords: '',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: env.NEXT_PUBLIC_BASE_URL,
    title: 'Grilla Cosquín Rock 2026',
    description:
      '¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio cronograma de shows!',
    siteName: 'Grilla Cosquín Rock 2026',
  },
  twitter: {
    card: 'summary_large_image',
    site: env.NEXT_PUBLIC_BASE_URL,
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Grilla Cosquín Rock 2026',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/apple-touch-icon-180x180.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#193e85',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>{children}</body>
    </html>
  )
}
