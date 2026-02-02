import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
// Note: Vite dev server automatically handles SPA routing (history API fallback)
// For production, use the server configuration files (_redirects, vercel.json, nginx.conf)
export default defineConfig({
  base: './',
  plugins: [react(),tailwindcss(),],
  build: {
    // Force fresh build by disabling cache
    emptyOutDir: true,
    // Add hash to filenames for cache busting
    rollupOptions: {
      output: {
        // Ensure unique filenames on each build
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
