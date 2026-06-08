import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const svgBuffer = Buffer.from(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="22" fill="#8B5CF6"/>
  <polygon points="58,10 35,52 50,52 42,90 68,45 52,45" fill="white"/>
</svg>`)

const icons = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 32,  name: 'favicon-32.png'  },
]

for (const { size, name } of icons) {
  await sharp(svgBuffer, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(join(root, 'public', name))
  console.log(`✅ Generated public/${name} (${size}x${size})`)
}
