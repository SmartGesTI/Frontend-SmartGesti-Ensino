import axios, { AxiosError } from 'axios';
import { ErrorLogger } from './errorLogger';

interface ApiErrorResponse {
  message?: string;
  statusCode?: number;
  error?: string;
  validation?: Record<string, string[]>;
}

// Flag para evitar múltiplos toasts do mesmo erro
let isHandlingError = false;

export function setupAxiosInterceptors() {
  // Interceptor de requisição (para adicionar headers globais, etc)
  axios.interceptors.request.use(
    (config) => {
      // Marcar que não está mais tratando erro
      isHandlingError = false;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de resposta (para tratamento de erros)
  axios.interceptors.response.use(
    (response) => {
      // Resposta bem-sucedida, apenas retorna
      return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
      // Pular interceptor se header X-Skip-Interceptor estiver presente
      if (error.config?.headers?.['X-Skip-Interceptor']) {
        return Promise.reject(error);
      }
      
      // Evitar múltiplos toasts do mesmo erro
      if (isHandlingError) {
        return Promise.reject(error);
      }
      
      isHandlingError = true;
      
      // Resetar flag após 500ms
      setTimeout(() => {
        isHandlingError = false;
      }, 500);

      // Erro de rede (sem resposta do servidor)
      if (!error.response) {
        ErrorLogger.handleNetworkError();
        return Promise.reject(error);
      }

      const { status, data } = error.response;

      // Tratamento por status code
      switch (status) {
        case 400:
          // Bad Request - pode ser erro de validação
          if (data.validation) {
            ErrorLogger.handleValidationError(data.validation);
          } else {
            ErrorLogger.handleApiError(error, 'BadRequest');
          }
          break;

        case 401:
          // Unauthorized - sessão expirada
          ErrorLogger.handleAuthError();
          break;

        case 403:
          // Forbidden - sem permissão
          ErrorLogger.handlePermissionError('este recurso', 'acessar');
          break;

        case 404:
          // Not Found
          ErrorLogger.handleApiError(error, 'NotFound');
          break;

        case 422:
          // Unprocessable Entity - erro de validação
          if (data.validation) {
            ErrorLogger.handleValidationError(data.validation);
          } else {
            ErrorLogger.handleApiError(error, 'ValidationError');
          }
          break;

        case 429:
          // Too Many Requests
          ErrorLogger.warning(
            'Muitas requisições',
            'Aguarde alguns instantes antes de tentar novamente'
          );
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server Errors
          ErrorLogger.handleApiError(error, 'ServerError');
          break;

        default:
          // Outros erros
          ErrorLogger.handleApiError(error, 'UnknownError');
      }

      return Promise.reject(error);
    }
  );
}
