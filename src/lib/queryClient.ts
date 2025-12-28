import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração otimizada do React Query
 * 
 * - staleTime: Tempo que os dados são considerados "frescos"
 * - cacheTime: Tempo que os dados ficam em cache após não serem mais usados
 * - refetchOnWindowFocus: Não refetch automático ao focar na janela
 * - retry: Número de tentativas em caso de erro
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados são considerados frescos por 5 minutos
      staleTime: 5 * 60 * 1000,
      
      // Dados ficam em cache por 10 minutos
      gcTime: 10 * 60 * 1000, // Antes era cacheTime, agora é gcTime
      
      // Não refetch automaticamente ao focar na janela
      refetchOnWindowFocus: false,
      
      // Não refetch automaticamente ao reconectar
      refetchOnReconnect: false,
      
      // Tentar apenas 1 vez em caso de erro
      retry: 1,
      
      // Delay entre retries (exponencial)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry apenas para erros de rede
      retry: (failureCount, error: any) => {
        // Não retry para erros 4xx (client errors)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          return false;
        }
        // Retry até 2 vezes para erros 5xx ou de rede
        return failureCount < 2;
      },
    },
  },
});

/**
 * Configuração específica para diferentes tipos de queries
 */
export const queryConfigs = {
  // Dados que mudam raramente (roles, permissions)
  static: {
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  },
  
  // Dados que mudam com frequência (invitations, notifications)
  dynamic: {
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  },
  
  // Dados em tempo real (chat, live updates)
  realtime: {
    staleTime: 0, // Sempre stale
    gcTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 30000, // Refetch a cada 30s
  },
};
