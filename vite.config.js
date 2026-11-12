import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'node:path'

// Builds the side panel page into dist/. Everything in public/ (manifest,
// background worker, icons) is copied as-is, so dist/ can be loaded unpacked.
export default defineConfig({
  base: './',
  plugins: [vue(), vuetify({ autoImport: true })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: { sidepanel: resolve(import.meta.dirname, 'sidepanel.html') },
    },
  },
})
