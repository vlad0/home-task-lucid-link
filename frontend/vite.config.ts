import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // TODO: export as ENVariable
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  }
})
