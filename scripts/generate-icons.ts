import { resolve } from 'node:path'
import sharp from 'sharp'

const INPUT = resolve(import.meta.dirname, '../src/app/icon.svg')
const OUTPUT_DIR = resolve(import.meta.dirname, '../public/icons')

const BACKGROUND_COLOR = { r: 9, g: 9, b: 11, alpha: 1 }

const icons = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
]

const maskableIcons = [
  { name: 'icon-maskable-192x192.png', size: 192 },
  { name: 'icon-maskable-512x512.png', size: 512 },
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

  const resized = await sharp(INPUT)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: icon.size,
      height: icon.size,
      channels: 4,
      background: BACKGROUND_COLOR,
    },
  })
    .composite([{ input: resized, gravity: 'centre' }])
    .png()
    .toFile(resolve(OUTPUT_DIR, icon.name))
  console.log(`Generated ${icon.name}`)
}

console.log('Done!')
