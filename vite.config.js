import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        hub: resolve(root, 'hub.html'),
        chapter01: resolve(root, 'chapters/chapter-01.html'),
        chapter02: resolve(root, 'chapters/chapter-02.html'),
        chapter03: resolve(root, 'chapters/chapter-03.html'),
        chapter04: resolve(root, 'chapters/chapter-04.html'),
      },
    },
  },
})
