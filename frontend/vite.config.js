import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
// Note: Vite dev server automatically handles SPA routing (history API fallback)
// For production, use the server configuration files (_redirects, vercel.json, nginx.conf)
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // Copy staticwebapp.config.json to dist after build
    {
      name: 'copy-staticwebapp-config',
      closeBundle() {
        try {
          copyFileSync(
            join(__dirname, 'staticwebapp.config.json'),
            join(__dirname, 'dist', 'staticwebapp.config.json')
          )
          console.log('✅ Copied staticwebapp.config.json to dist/')
        } catch (error) {
          console.error('❌ Failed to copy staticwebapp.config.json:', error.message)
        }
      }
    }
  ],
  build: {
    // Force fresh build by disabling cache
    emptyOutDir: true,
    // Copy public directory contents
    copyPublicDir: true,
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
