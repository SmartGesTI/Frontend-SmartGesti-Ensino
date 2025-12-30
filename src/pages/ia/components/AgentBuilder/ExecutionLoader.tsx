import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Loader2, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ExecutionPhase = 'reading' | 'analyzing' | 'summarizing' | 'generating' | 'complete' | 'error'

interface ExecutionLoaderProps {
  phase: ExecutionPhase
  error?: string
  onDownload?: () => void
  onClose?: () => void
}

export const phaseMessages: Record<ExecutionPhase, string> = {
  reading: 'Estou lendo o texto que você me passou...',
  analyzing: 'Já li o texto. Agora vou fazer uma análise detalhada',
  summarizing: 'Entendi todo o contexto, vou começar a gerar o seu resumo...',
  generating: 'O resumo está pronto! Estou gerando o relatório...',
  complete: 'O resumo está pronto! Clique no botão Download para baixar o seu relatório',
  error: 'Ops! Algo deu errado durante a execução',
}

const phaseProgress: Record<ExecutionPhase, number> = {
  reading: 25,
  analyzing: 50,
  summarizing: 75,
  generating: 90,
  complete: 100,
  error: 0,
}

/**
 * Loader animado com mensagens humanas mostrando o progresso da execução
 */
export function ExecutionLoader({ phase, error, onDownload, onClose }: ExecutionLoaderProps) {
  const [displayMessage, setDisplayMessage] = useState(phaseMessages[phase])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Animação suave de transição de mensagem
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayMessage(phaseMessages[phase])
      setIsAnimating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [phase])

  const progress = phaseProgress[phase]
  const isComplete = phase === 'complete'
  const hasError = phase === 'error'

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {/* Ícone animado */}
          <div className="relative mb-6">
            {hasError ? (
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <X className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            ) : isComplete ? (
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <div className="relative w-20 h-20">
                <Loader2 className="w-20 h-20 text-purple-600 dark:text-purple-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Mensagem */}
          <div className="text-center mb-6 min-h-[60px] flex items-center">
            <p
              className={cn(
                'text-lg font-medium transition-all duration-300',
                isAnimating && 'opacity-0 scale-95',
                !isAnimating && 'opacity-100 scale-100',
                hasError && 'text-red-600 dark:text-red-400',
                !hasError && 'text-gray-900 dark:text-gray-100'
              )}
            >
              {error || displayMessage}
            </p>
          </div>

          {/* Barra de progresso */}
          {!hasError && (
            <div className="w-full max-w-xs mb-6">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3 w-full max-w-xs">
            {isComplete && onDownload && (
              <Button
                onClick={onDownload}
                className="flex-1 gap-2"
                variant="aiPrimary"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
            {(isComplete || hasError) && onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Fechar
              </Button>
            )}
          </div>

          {/* Indicador de fase */}
          {!hasError && !isComplete && (
            <div className="mt-4 flex gap-2">
              {['reading', 'analyzing', 'summarizing', 'generating'].map((p) => {
                const isActive = phase === p
                const isPast = phaseProgress[phase as ExecutionPhase] > phaseProgress[p as ExecutionPhase]
                return (
                  <div
                    key={p}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      isActive && 'bg-purple-600 dark:bg-purple-400 w-6',
                      isPast && 'bg-purple-400 dark:bg-purple-500',
                      !isActive && !isPast && 'bg-gray-300 dark:bg-gray-600'
                    )}
                  />
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

