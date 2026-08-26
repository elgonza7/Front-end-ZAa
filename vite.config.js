import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forwards /api/* to the ASP.NET Core backend (see Zero/Properties/launchSettings.json).
      // Adjust the target if the backend port changes, or set VITE_API_BASE_URL instead.
      '/api': {
        target: 'http://localhost:5041',
        changeOrigin: true,
      },
    },
  },
})
