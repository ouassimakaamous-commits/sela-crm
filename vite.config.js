import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // When using `vercel dev`, it runs on 3000 and serves both
    // the Vite frontend and the /api routes together — no proxy needed.
    // This proxy is only for `npm run dev` without vercel dev.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
