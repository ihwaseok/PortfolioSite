import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@joplin': fileURLToPath(new URL('./../backend/static/joplin', import.meta.url))
    }
  },
  build: {
    outDir: '../backend/dist/public',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        /mermaid/
      ]
    },
    chunkSizeWarningLimit: 5000
  }
})
