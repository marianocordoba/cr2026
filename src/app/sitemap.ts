import type { MetadataRoute } from 'next'

import { env } from '@/env'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 1,
      url: env.NEXT_PUBLIC_BASE_URL,
    },
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 0.9,
      url: `${env.NEXT_PUBLIC_BASE_URL}/schedule`,
    },
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 0.8,
      url: `${env.NEXT_PUBLIC_BASE_URL}/artists`,
    },
  ]
}
