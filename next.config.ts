import type { NextConfig } from 'next'

import withSerwistInit from '@serwist/next'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'zx'

export default async function config() {
  const revision = await $`git rev-parse HEAD`.text()

  const artistImagesDir = join(process.cwd(), 'public/images/artists')
  const artistImages = readdirSync(artistImagesDir)
    .filter((file) => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
    .map((file) => ({ url: `/images/artists/${file}`, revision }))

  const withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
    cacheOnNavigation: true,
    reloadOnOnline: true,
    additionalPrecacheEntries: [
      { url: '/', revision },
      { url: '/schedule', revision },
      { url: '/artists', revision },
      { url: '/data/days.json', revision },
      { url: '/data/stages.json', revision },
      { url: '/data/artists.json', revision },
      { url: '/data/shows.json', revision },
      ...artistImages,
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
