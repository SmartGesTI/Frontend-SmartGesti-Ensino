import { toast } from 'sonner';
import { logger } from './logger';

interface ApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
      error?: string;
    };
    status?: number;
  };
  message?: string;
  config?: {
    url?: string;
    method?: string;
  };
}

export class ErrorLogger {
  /**
   * Log genérico de erro
   */
  static logError(error: Error, context?: string) {
    logger.error(`[${context || 'App'}] ${error.message}`);

    console.group(`🔴 Erro em ${context || 'App'}`);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.groupEnd();
  }

  /**
   * Tratamento de erros de API
   */
  static handleApiError(error: ApiError, _context?: string) {
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      'Erro desconhecido na requisição';
    
    const status = error.response?.status || error.response?.data?.statusCode;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    logger.error(`[API Error] ${status} ${method} ${url}: ${message}`);

    console.group('🔴 Erro de API');
    console.error('Status:', status);
    console.error('URL:', url);
    console.error('Method:', method);
    console.error('Mensagem:', message);
    console.error('Erro completo:', error);
    console.groupEnd();

    // Não exibir toast para erros 401 (tratados separadamente)
    if (status !== 401) {
      toast.error('Erro na requisição', {
        description: message,
        duration: 5000,
        action: status && status >= 500 ? {
          label: 'Reportar',
          onClick: () => {
            console.log('Reportar erro:', { status, url, message });
            // Aqui você pode adicionar integração com Sentry, etc
          },
        } : undefined,
      });
    }
  }

  /**
   * Erro de permissão
   */
  static handlePermissionError(resource: string, action: string) {
    const message = `Você não tem permissão para ${action} ${resource}`;
    
    logger.warn(`[Permission Denied] ${action} ${resource}`);

    console.warn('⚠️ Permissão negada:', { resource, action });

    toast.error('Permissão negada', {
      description: message,
      duration: 4000,
    });
  }

  /**
   * Erro de autenticação
   */
  static handleAuthError(redirectToLogin = true) {
    logger.error('[Auth Error] Sessão expirada ou inválida');

    console.error('🔴 Erro de autenticação - sessão expirada');

    toast.error('Erro de autenticação', {
      description: 'Sua sessão expirou. Faça login novamente.',
      duration: 5000,
      action: redirectToLogin ? {
        label: 'Login',
        onClick: () => {
          window.location.href = '/login';
        },
      } : undefined,
    });
  }

  /**
   * Erro de validação
   */
  static handleValidationError(fields: Record<string, string[]>) {
    const firstField = Object.keys(fields)[0];
    const firstError = fields[firstField]?.[0];

    logger.warn(`[Validation Error] ${JSON.stringify(fields)}`);

    console.warn('⚠️ Erro de validação:', fields);

    toast.error('Erro de validação', {
      description: firstError || 'Verifique os campos do formulário',
      duration: 4000,
    });
  }

  /**
   * Erro de rede
   */
  static handleNetworkError() {
    logger.error('[Network Error] Sem conexão com o servidor');

    console.error('🔴 Erro de rede - sem conexão');

    toast.error('Erro de conexão', {
      description: 'Não foi possível conectar ao servidor. Verifique sua internet.',
      duration: 6000,
      action: {
        label: 'Tentar novamente',
        onClick: () => window.location.reload(),
      },
    });
  }

  /**
   * Sucesso (para feedback positivo)
   */
  static success(message: string, description?: string) {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }

  /**
   * Info
   */
  static info(message: string, description?: string) {
    toast.info(message, {
      description,
      duration: 4000,
    });
  }

  /**
   * Warning
   */
  static warning(message: string, description?: string) {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  }
}
