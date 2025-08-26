import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // Chemins relatifs pour Electron
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/renderer/components'),
      '@views': resolve(__dirname, 'src/renderer/views'),
      '@stores': resolve(__dirname, 'src/renderer/stores'),
      '@composables': resolve(__dirname, 'src/renderer/composables'),
      '@utils': resolve(__dirname, 'src/renderer/utils'),
      '@types': resolve(__dirname, 'src/renderer/types')
    }
  },
  server: {
    port: 3000,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue': ['vue'],
          'vue-router': ['vue-router'],
          'pinia': ['pinia'],
          'vueuse': ['@vueuse/core'],
          'lucide': ['lucide-vue-next']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})
