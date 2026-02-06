import type { Metadata, Viewport } from 'next'

import { Outfit } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'
import { env } from '@/env'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Grilla Cosquín Rock 2026',
  },
  description:
    '¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio cronograma de shows!',
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [{ sizes: '180x180', url: '/icons/apple-touch-icon-180x180.png' }],
    shortcut: '/favicon.ico',
  },
  keywords: '',
  manifest: '/manifest.webmanifest',
  openGraph: {
    description:
      '¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio cronograma de shows!',
    siteName: 'Grilla Cosquín Rock 2026',
    title: 'Grilla Cosquín Rock 2026',
    type: 'website',
    url: env.NEXT_PUBLIC_BASE_URL,
  },
  robots: 'index, follow',
  title: 'Grilla Cosquín Rock 2026',
  twitter: {
    card: 'summary_large_image',
    site: env.NEXT_PUBLIC_BASE_URL,
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: '#193e85',
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
