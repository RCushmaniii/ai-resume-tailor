import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs-extra'
import type { ViteDevServer } from 'vite'

// Custom plugin to copy markdown files to the build output
function copyMarkdownFiles() {
  return {
    name: 'copy-markdown-files',
    configureServer(server: ViteDevServer) {
      const docsDir = resolve(__dirname, '..', 'docs')
      const publicDocsDir = resolve(__dirname, 'public', 'docs')

      const syncDocsToPublic = () => {
        if (!fs.existsSync(docsDir)) return

        fs.copySync(docsDir, publicDocsDir)
        console.log(`✅ Synced docs to ${publicDocsDir}`)
      }

      syncDocsToPublic()
      server.watcher.add(docsDir)

      server.watcher.on('all', (_event, filePath) => {
        if (typeof filePath === 'string' && filePath.startsWith(docsDir)) {
          syncDocsToPublic()
        }
      })
    },
    writeBundle() {
      try {
        const docsSourceDir = resolve(__dirname, '..', 'docs')
        const docsTargetDir = 'dist/docs'

        if (fs.existsSync(docsSourceDir)) {
          fs.copySync(docsSourceDir, docsTargetDir)
          console.log(`✅ Copied docs to ${docsTargetDir}`)
        }
        
        // Ensure the legal directory is copied
        if (fs.existsSync('public/legal')) {
          fs.copySync('public/legal', 'dist/legal')
          console.log('✅ Copied legal markdown files to dist/legal')
        }
        
        console.log('✅ Successfully copied docs markdown files to dist')
      } catch (error) {
        console.error('❌ Error copying markdown files:', error)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyMarkdownFiles()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  // Add public directory configuration
  publicDir: 'public',
  build: {
    outDir: 'dist',
    // Ensure assets are copied
    assetsInlineLimit: 0,
    // Code splitting and chunk optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and React-DOM into their own chunk
          'react-vendor': ['react', 'react-dom'],
          // Separate UI library components
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
          ],
          // Separate charting library
          'charts-vendor': ['recharts'],
          // Separate other large dependencies
          'utils-vendor': ['clsx', 'class-variance-authority', 'tailwind-merge'],
          // Toast notification library
          'toast-vendor': ['sonner'],
        },
      },
    },
    // Increase chunk size warning limit since we're splitting properly
    chunkSizeWarningLimit: 600,
  },
  server: {
    // Configure the dev server to handle client-side routing
    host: true,
    port: 3000,
    strictPort: false,
    open: true,
    // Use middleware to handle client-side routing
    middlewareMode: false,
    fs: {
      // Prevent serving files from root that might conflict with routes
      deny: ['components.json'],
      allow: [resolve(__dirname, '..')]
    },
    // Proxy API requests to Flask backend
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    // Configure the preview server
    host: true,
    port: 4173,
    strictPort: false,
    open: true,
  }
})
