import type { NextConfig } from 'next'

import withSerwistInit from '@serwist/next'
import { $ } from 'zx'

export default async function config() {
  const revision = await $`git rev-parse HEAD`.text()

  const withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
    cacheOnNavigation: true,
    reloadOnOnline: true,
    additionalPrecacheEntries: [
      { url: '/', revision },
      { url: '/schedule', revision },
      { url: '/artists', revision },
    ],
    disable: process.env.NODE_ENV === 'development',
  })

  const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'export',
    turbopack: {},
    devIndicators: false,
    allowedDevOrigins: ['192.168.1.150'],
    images: {
      unoptimized: true,
    },
  }

  return withSerwist(nextConfig)
}
