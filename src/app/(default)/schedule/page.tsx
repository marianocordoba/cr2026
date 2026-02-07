import type { Metadata } from 'next'

import { ScheduleView } from './view'

export const metadata: Metadata = {
  alternates: {
    canonical: '/schedule',
  },
  description:
    'Grilla completa de shows del Cosquín Rock 2026. Consultá los horarios de los 113 shows en 8 escenarios durante el 14 y 15 de febrero.',
  openGraph: {
    description:
      'Grilla completa de shows del Cosquín Rock 2026. 113 shows, 8 escenarios, 2 días de festival.',
    title: 'Grilla de Shows | Cosquín Rock 2026',
    url: '/schedule',
  },
  title: 'Grilla de Shows',
}

export default function Page() {
  return <ScheduleView />
}
