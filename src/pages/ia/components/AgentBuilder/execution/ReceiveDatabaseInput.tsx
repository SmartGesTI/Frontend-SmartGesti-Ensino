import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Database, Play, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { ErrorLogger } from '@/lib/errorLogger'

interface ReceiveDatabaseInputProps {
  value?: any
  onChange: (value: any) => void
  query?: string
}

/**
 * Componente de entrada para receber dados de banco de dados via SQL
 */
export function ReceiveDatabaseInput({ value, onChange, query = '' }: ReceiveDatabaseInputProps) {
  const [sqlQuery, setSqlQuery] = useState(query)
  const [isLoading, setIsLoading] = useState(false)

  const handleTestQuery = async () => {
    if (!sqlQuery.trim()) {
      ErrorLogger.logError(new Error('Por favor, informe uma query SQL'), 'ReceiveDatabaseInput')
      return
    }

    // Validar que é uma query SELECT (por segurança)
    const trimmedQuery = sqlQuery.trim().toUpperCase()
    if (!trimmedQuery.startsWith('SELECT')) {
      ErrorLogger.logError(
        new Error('Por segurança, apenas queries SELECT são permitidas'),
        'ReceiveDatabaseInput'
      )
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implementar chamada real à API para executar query
      // Por enquanto, simular resposta
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onChange({
        query: sqlQuery,
        data: [], // Será preenchido pela API real
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      ErrorLogger.logError(error, 'ReceiveDatabaseInput')
      onChange({
        query: sqlQuery,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Query SQL</Label>
      
      <div className="space-y-2">
        <Textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="SELECT * FROM tabela WHERE condicao = 'valor'"
          className="min-h-[120px] text-sm font-mono"
        />
        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-3 h-3" />
          <span>Apenas queries SELECT são permitidas por segurança</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleTestQuery}
        disabled={isLoading || !sqlQuery.trim()}
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <Database className="w-4 h-4 animate-spin" />
            Executando...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Executar Query
          </>
        )}
      </Button>

      {value && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Resultado:
          </p>
          {value.error ? (
            <p className="text-xs text-red-600 dark:text-red-400">{value.error}</p>
          ) : (
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
              {JSON.stringify(value.data || value, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
