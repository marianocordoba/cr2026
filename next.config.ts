import  { type NextConfig } from 'next'

import withSerwistInit from '@serwist/next'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { $ } from 'zx'

export default async function config() {
  const revision = await $`git rev-parse HEAD`.text()

  const artistImagesDir = join(process.cwd(), 'public/images/artists')
  const artistImages = readdirSync(artistImagesDir)
    .filter((file) => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
    .map((file) => ({ revision, url: `/images/artists/${file}` }))

  const withSerwist = withSerwistInit({
    additionalPrecacheEntries: [
      { revision, url: '/' },
      { revision, url: '/schedule' },
      { revision, url: '/artists' },
      { revision, url: '/data/days.json' },
      { revision, url: '/data/stages.json' },
      { revision, url: '/data/artists.json' },
      { revision, url: '/data/shows.json' },
      ...artistImages,
    ],
    cacheOnNavigation: true,
    disable: process.env.NODE_ENV === 'development',
    reloadOnOnline: true,
    swDest: 'public/sw.js',
    swSrc: 'src/app/sw.ts',
  })

  const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.1.150'],
    devIndicators: false,
    images: {
      unoptimized: true,
    },
    output: 'export',
    reactStrictMode: true,
    turbopack: {},
  }

  return withSerwist(nextConfig)
}
