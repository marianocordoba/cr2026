import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Grilla Cosquín Rock 2026',
    short_name: 'Grilla CR 2026',
    description:
      '¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio cronograma de shows!',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#09090b',
    theme_color: '#193e85',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/1.jpg',
        sizes: '1080x2200',
        type: 'image/jpeg',
        form_factor: 'narrow',
      },
      {
        src: '/screenshots/2.jpg',
        sizes: '1080x2200',
        type: 'image/jpeg',
        form_factor: 'narrow',
      },
    ],
  }
}
