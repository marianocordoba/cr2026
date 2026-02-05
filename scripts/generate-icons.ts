import { resolve } from 'node:path'
import sharp from 'sharp'

const INPUT = resolve(import.meta.dirname, '../src/app/icon.svg')
const OUTPUT_DIR = resolve(import.meta.dirname, '../public/icons')

const BACKGROUND_COLOR = { alpha: 1, b: 133, g: 62, r: 25 }

const icons = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
]

const maskableIcons = [
  { name: 'icon-maskable-192x192.png', size: 192, source: 'icon-192x192.png' },
  { name: 'icon-maskable-512x512.png', size: 512, source: 'icon-512x512.png' },
]

for (const icon of icons) {
  await sharp(INPUT)
    .resize(icon.size, icon.size)
    .png()
    .toFile(resolve(OUTPUT_DIR, icon.name))
  console.log(`Generated ${icon.name}`)
}

for (const icon of maskableIcons) {
  const padding = Math.round(icon.size * 0.1)
  const innerSize = icon.size - padding * 2
  const sourceFile = resolve(OUTPUT_DIR, icon.source)

  const resized = await sharp(sourceFile)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer()

  await sharp({
    create: {
      background: BACKGROUND_COLOR,
      channels: 4,
      height: icon.size,
      width: icon.size,
    },
  })
    .composite([{ gravity: 'centre', input: resized }])
    .png()
    .toFile(resolve(OUTPUT_DIR, icon.name))
  console.log(`Generated ${icon.name}`)
}

console.log('Done!')
