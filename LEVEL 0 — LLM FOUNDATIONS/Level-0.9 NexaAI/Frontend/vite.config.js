import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://nexaai-tahr.onrender.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // proxy error suppressed in production
          });
          proxy.on('proxyRes', (proxyRes) => {
            // Disable response buffering for streaming endpoints
            proxyRes.headers['x-accel-buffering'] = 'no';
          });
        },
      }
    }
  }
})
