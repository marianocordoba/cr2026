import type { Metadata } from 'next'

import { ArtistsView } from './view'

export const metadata: Metadata = {
  alternates: {
    canonical: '/artists',
  },
  description:
    'Los 115 artistas del Cosquín Rock 2026. Descubrí quién toca y armá tu cronograma personalizado del festival.',
  openGraph: {
    description:
      'Los 115 artistas del Cosquín Rock 2026. Consultá la grilla completa y creá tu cronograma.',
    title: 'Artistas | Cosquín Rock 2026',
    url: '/artists',
  },
  title: 'Artistas',
}

export default function Page() {
  return <ArtistsView />
}
