// Renders the toolbar/extension PNG icons from the SVG sources in branding/.
// 16 and 32px use a simplified mark so it stays legible at tiny sizes.
import { Resvg } from '@resvg/resvg-js'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const sources = {
  16: 'branding/icon-small.svg',
  32: 'branding/icon-small.svg',
  48: 'branding/icon.svg',
  128: 'branding/icon.svg',
}

mkdirSync('public/icons', { recursive: true })
for (const [size, file] of Object.entries(sources)) {
  const png = new Resvg(readFileSync(file), { fitTo: { mode: 'width', value: Number(size) } }).render().asPng()
  writeFileSync(`public/icons/icon${size}.png`, png)
}
console.log('icons written to public/icons')
