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
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full bg-card shadow-lg rounded-lg p-6 border border-border">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-500/10 rounded-full">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground text-center">
              Algo deu errado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer font-medium">Stack Trace</summary>
                <pre className="mt-2 overflow-auto max-h-40 text-xs">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Recarregar Página
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
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
