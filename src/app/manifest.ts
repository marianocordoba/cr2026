import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#09090b',
    description:
      '¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio cronograma de shows!',
    display: 'standalone',
    icons: [
      {
        sizes: '48x48',
        src: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        purpose: 'any',
        sizes: '192x192',
        src: '/icons/icon-192x192.png',
        type: 'image/png',
      },
      {
        purpose: 'any',
        sizes: '512x512',
        src: '/icons/icon-512x512.png',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        sizes: '192x192',
        src: '/icons/icon-maskable-192x192.png',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: '/icons/icon-maskable-512x512.png',
        type: 'image/png',
      },
    ],
    id: '/',
    name: 'Grilla Cosquín Rock 2026',
    orientation: 'portrait',
    screenshots: [
      {
        form_factor: 'narrow',
        sizes: '1080x2254',
        src: '/screenshots/1.webp',
        type: 'image/webp',
      },
      {
        form_factor: 'narrow',
        sizes: '1080x2254',
        src: '/screenshots/2.webp',
        type: 'image/webp',
      },
      {
        form_factor: 'narrow',
        sizes: '1080x2254',
        src: '/screenshots/3.webp',
        type: 'image/webp',
      },
    ],
    short_name: 'Grilla CR 2026',
    start_url: '/',
    theme_color: '#09090b',
  }
}
