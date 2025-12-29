import { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { AlertCircle, RefreshCw, X, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  private copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copiado para a área de transferência!');
    });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border-2 border-red-200 dark:border-red-800 bg-card">
            <CardHeader className="bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-950/30 dark:to-transparent border-b border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-red-600 dark:text-red-400 text-2xl">
                      Erro na Aplicação
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Ocorreu um erro inesperado
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Mensagem do Erro */}
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                        Mensagem do Erro
                      </h4>
                      <p className="text-red-700 dark:text-red-300 text-sm font-mono break-words">
                        {this.state.error?.message || 'Erro desconhecido'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => this.copyToClipboard(this.state.error?.message || '')}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stack Trace */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Stack Trace
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => this.copyToClipboard(this.state.error?.stack || '')}
                      className="h-8"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Stack Trace
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-900 dark:bg-gray-950 border border-gray-700 overflow-auto max-h-96">
                    <pre className="text-xs text-gray-300 dark:text-gray-400 font-mono whitespace-pre-wrap break-words">
                      {this.state.error?.stack || 'Stack trace não disponível'}
                    </pre>
                  </div>
                </div>

                {/* Informações Adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tipo do Erro
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {this.state.error?.name || 'Error'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Timestamp
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date().toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white h-11"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recarregar Página
                  </Button>
                  <Button
                    onClick={() => this.setState({ hasError: false, error: null })}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 h-11"
                  >
                    Tentar Novamente
                  </Button>
                  <Button
                    onClick={() => {
                      const errorReport = {
                        message: this.state.error?.message,
                        stack: this.state.error?.stack,
                        name: this.state.error?.name,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        url: window.location.href,
                      };
                      this.copyToClipboard(JSON.stringify(errorReport, null, 2));
                    }}
                    variant="outline"
                    className="flex-1 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 h-11"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
