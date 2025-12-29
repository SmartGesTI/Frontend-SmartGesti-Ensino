import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Plugin para garantir que react-vendor seja pré-carregado PRIMEIRO
function reactVendorPreload() {
  return {
    name: 'react-vendor-preload',
    transformIndexHtml(html: string) {
      // Encontrar o react-vendor preload
      const reactVendorPreloadMatch = html.match(/<link rel="modulepreload"[^>]*react-vendor[^>]*>/)
      
      if (reactVendorPreloadMatch) {
        const reactVendorPreload = reactVendorPreloadMatch[0]
        
        // Remover react-vendor da posição atual
        html = html.replace(reactVendorPreload, '')
        
        // Remover todos os outros modulepreloads temporariamente
        const allPreloads = html.match(/<link rel="modulepreload"[^>]*>/g) || []
        allPreloads.forEach(preload => {
          html = html.replace(preload, '')
        })
        
        // Inserir react-vendor como PRIMEIRO, antes de todos os outros preloads
        // Inserir antes do primeiro script type="module"
        const scriptMatch = html.match(/<script type="module"[^>]*>/)
        if (scriptMatch) {
          html = html.replace(
            scriptMatch[0],
            '    ' + reactVendorPreload + '\n' +
            allPreloads.map(p => '    ' + p).join('\n') + '\n    ' + scriptMatch[0]
          )
        }
      }
      return html
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactVendorPreload()],
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
        // Garantir ordem de carregamento: react-vendor primeiro
        // Isso garante que React esteja disponível antes de outros chunks
        manualChunks(id, { getModuleInfo }) {
          // Separar node_modules em chunks menores
          if (id.includes('node_modules')) {
            // React e ReactDOM juntos - SEMPRE primeiro (chunk base)
            // Incluir também react-router que depende do React
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            // TODAS as bibliotecas que dependem do React devem estar aqui
            // Radix UI components - DEPENDEM DO REACT
            // Agrupar com React para garantir que sejam carregados juntos
            // Isso evita o erro "Cannot read properties of undefined (reading 'useLayoutEffect')"
            if (id.includes('@radix-ui')) {
              return 'react-vendor' // Agrupar com React para garantir ordem
            }
            // @tanstack/react-query - DEPENDE DO REACT
            if (id.includes('@tanstack/react-query')) {
              return 'react-vendor'
            }
            // recharts - DEPENDE DO REACT
            if (id.includes('recharts')) {
              return 'react-vendor'
            }
            // Bibliotecas auxiliares do React usadas por Radix UI e outras
            // use-sidecar, use-sync-external-store - DEPENDEM DO REACT
            if (id.includes('use-sidecar') || id.includes('use-sync-external-store')) {
              return 'react-vendor'
            }
            // @floating-ui - usado pelo Radix UI e depende do React
            if (id.includes('@floating-ui') || id.includes('floating-ui')) {
              return 'react-vendor'
            }
            // Verificar se é uma biblioteca React (começa com @ e contém react)
            // ou tem 'react' no nome do pacote
            const reactMatch = id.match(/node_modules\/(@[^/]+\/)?([^/]+)/)
            if (reactMatch) {
              const packageName = (reactMatch[2] || reactMatch[1]?.slice(1) || '').toLowerCase()
              // Se o nome do pacote contém 'react' (exceto react, react-dom que já foram capturados)
              // ou é uma biblioteca conhecida que depende do React
              if (packageName.includes('react') && !packageName.includes('reactflow')) {
                return 'react-vendor'
              }
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
            // Mas zustand/react depende do React, então agrupar com React
            if (id.includes('zustand/react') || id.includes('zustand/esm') && id.includes('/react')) {
              return 'react-vendor'
            }
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
            // Verificar se há outras bibliotecas que podem depender do React
            // antes de dividir em chunks vendor
            const vendorMatch = id.match(/node_modules\/(@[^/]+\/)?([^/]+)/)
            if (vendorMatch) {
              const packageName = (vendorMatch[2] || vendorMatch[1]?.slice(1) || '').toLowerCase()
              
              // Bibliotecas conhecidas que podem depender do React indiretamente
              // ou que são comumente usadas com React
              const reactDependentLibs = [
                'use-sidecar', 'use-sync-external-store', 'use-isomorphic-layout-effect',
                'aria-hidden', 'floating-ui', '@floating-ui', 'focus-trap', 'focus-trap-react'
              ]
              
              if (packageName.length > 0 && reactDependentLibs.some(lib => packageName.includes(lib))) {
                return 'react-vendor'
              }
            }
            
            // Dividir vendor restante em chunks maiores para reduzir número de chunks
            // e evitar problemas de ordem de carregamento
            // Agrupar em chunks maiores: a-l, m-z
            const match2 = id.match(/node_modules\/(@[^/]+\/)?([^/]+)/)
            if (match2) {
              const packageName = (match2[2] || match2[1]?.slice(1) || '').toLowerCase()
              if (packageName.length > 0) {
                // Dividir em apenas 2 grupos grandes para reduzir problemas de ordem
                const firstLetter = packageName[0]
                if (firstLetter >= 'a' && firstLetter <= 'l') {
                  return 'vendor-a-l'
                } else if (firstLetter >= 'm' && firstLetter <= 'z') {
                  return 'vendor-m-z'
                }
              }
            }
            // Fallback
            return 'vendor-other'
          }
        },
        // Garantir que react-vendor seja sempre o primeiro chunk a ser carregado
        // através da ordem de dependências
        chunkFileNames: (chunkInfo) => {
          // Se for react-vendor, garantir que seja carregado primeiro
          if (chunkInfo.name === 'react-vendor') {
            return 'assets/react-vendor-[hash].js'
          }
          return 'assets/[name]-[hash].js'
        },
      },
      // Garantir que react-vendor seja sempre carregado primeiro
      // através da configuração de external e dependências
      external: [],
      // Garantir ordem de carregamento através de output.entryFileNames
      // mas isso não é necessário aqui
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
