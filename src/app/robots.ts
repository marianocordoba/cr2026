import type { MetadataRoute } from 'next'

import { env } from '@/env'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      userAgent: '*',
    },
    sitemap: `${env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  }
}
