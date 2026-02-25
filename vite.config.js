import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  plugins: [vue()],
  server: {
    port: 3000,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    outDir: '../dist'
  }
})
