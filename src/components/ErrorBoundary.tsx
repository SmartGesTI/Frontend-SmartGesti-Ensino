import { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log detalhado do erro
    logger.error(`ErrorBoundary capturou erro: ${error.message}`);

    // Exibir toast com detalhes
    toast.error('Erro na aplicação', {
      description: error.message,
      duration: 10000,
      action: {
        label: 'Ver detalhes',
        onClick: () => {
          console.group('🔴 Detalhes do Erro');
          console.error('Mensagem:', error.message);
          console.error('Stack:', error.stack);
          console.error('Component Stack:', errorInfo.componentStack);
          console.groupEnd();
        },
      },
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100 text-center">
              Algo deu errado
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <details className="text-xs text-gray-600 dark:text-gray-400">
                <summary className="cursor-pointer font-medium">Stack Trace</summary>
                <pre className="mt-2 overflow-auto max-h-40 text-xs">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Recarregar Página
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
