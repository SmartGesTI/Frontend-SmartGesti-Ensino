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
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar node_modules em chunks menores
          if (id.includes('node_modules')) {
            // React e ReactDOM juntos - SEMPRE primeiro (chunk base)
            // Incluir também react-router que depende do React
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            // Radix UI components - DEPENDEM DO REACT
            // Agrupar com React para garantir que sejam carregados juntos
            // Isso evita o erro "Cannot read properties of undefined (reading 'useLayoutEffect')"
            if (id.includes('@radix-ui')) {
              return 'react-vendor' // Agrupar com React para garantir ordem
            }
            // ReactFlow separado (biblioteca muito grande ~400KB)
            // Verifica tanto 'reactflow' quanto '@reactflow' e '@xyflow' (nomes internos)
            if (id.includes('reactflow') || id.includes('@reactflow') || id.includes('@xyflow')) {
              return 'reactflow'
            }
            // D3 libraries (usadas pelo ReactFlow) - separar também
            if (id.includes('d3-')) {
              return 'd3-vendor'
            }
            // Lucide icons (pode ser grande, mas não depende do React diretamente)
            if (id.includes('lucide-react')) {
              return 'icons-vendor'
            }
            // Tailwind e CSS relacionado
            if (id.includes('tailwindcss') || id.includes('postcss') || id.includes('autoprefixer')) {
              return 'css-vendor'
            }
            // Outras bibliotecas grandes separadas
            if (id.includes('sonner')) {
              return 'sonner'
            }
            if (id.includes('date-fns')) {
              return 'date-fns'
            }
            // Separar outras bibliotecas grandes individualmente se necessário
            if (id.includes('zustand') || id.includes('jotai') || id.includes('recoil')) {
              return 'state-vendor'
            }
            // Separar mais agressivamente: dividir vendor em chunks menores por grupos
            const match = id.match(/node_modules\/(@[^/]+\/)?([^/]+)/)
            if (match) {
              const packageName = match[2] || match[1]?.slice(1) || ''
              // Separar bibliotecas grandes conhecidas individualmente
              if (packageName.length > 0) {
                const largeLibs = ['lodash', 'moment', 'dayjs', 'axios', 'class-variance-authority', 'clsx', 'tailwind-merge']
                if (largeLibs.some(lib => packageName.includes(lib))) {
                  return `lib-${packageName}`
                }
              }
            }
            // Dividir vendor restante em chunks balanceados
            // Agrupar por range de letras, mas dividir mais se necessário
            const match2 = id.match(/node_modules\/(@[^/]+\/)?([^/]+)/)
            if (match2) {
              const packageName = (match2[2] || match2[1]?.slice(1) || '').toLowerCase()
              if (packageName.length > 0) {
                // Dividir em mais grupos para evitar chunks muito grandes
                // a-d, e-h, i-l, m-p, q-t, u-z
                const firstLetter = packageName[0]
                if (firstLetter >= 'a' && firstLetter <= 'd') {
                  return 'vendor-a-d'
                } else if (firstLetter >= 'e' && firstLetter <= 'h') {
                  return 'vendor-e-h'
                } else if (firstLetter >= 'i' && firstLetter <= 'l') {
                  return 'vendor-i-l'
                } else if (firstLetter >= 'm' && firstLetter <= 'p') {
                  return 'vendor-m-p'
                } else if (firstLetter >= 'q' && firstLetter <= 't') {
                  return 'vendor-q-t'
                } else if (firstLetter >= 'u' && firstLetter <= 'z') {
                  return 'vendor-u-z'
                }
              }
            }
            // Fallback
            return 'vendor-other'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumentar limite para 1MB (já que estamos fazendo code splitting)
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
