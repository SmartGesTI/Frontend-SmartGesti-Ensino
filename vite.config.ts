import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'jspdf'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('reactflow')) {
              return 'reactflow'
            }
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true, // Permite acesso via IP e subdomínios locais
    // Proxy apenas para desenvolvimento local
    // Em produção, as requisições vão diretamente para VITE_API_URL configurado nas variáveis de ambiente
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
