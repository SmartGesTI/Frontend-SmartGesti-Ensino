import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Globe, Play } from 'lucide-react'
import { useState } from 'react'

interface ReceiveApiInputProps {
  value?: any
  onChange: (value: any) => void
  endpoint?: string
  method?: string
}

/**
 * Componente de entrada para receber dados de API
 */
export function ReceiveApiInput({ value, onChange, endpoint = '', method = 'GET' }: ReceiveApiInputProps) {
  const [apiEndpoint, setApiEndpoint] = useState(endpoint)
  const [apiMethod, setApiMethod] = useState(method)
  const [isLoading, setIsLoading] = useState(false)

  const handleTestConnection = async () => {
    if (!apiEndpoint) {
      alert('Por favor, informe o endpoint da API')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(apiEndpoint, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      onChange({
        endpoint: apiEndpoint,
        method: apiMethod,
        data,
        status: response.status,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      onChange({
        endpoint: apiEndpoint,
        method: apiMethod,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Configuração da API</Label>
      
      <div className="space-y-2">
        <Label className="text-xs font-medium">Método HTTP</Label>
        <Select value={apiMethod} onValueChange={setApiMethod}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Endpoint</Label>
        <Input
          type="url"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          placeholder="https://api.exemplo.com/dados"
          className="h-9 text-sm"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleTestConnection}
        disabled={isLoading || !apiEndpoint}
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <Globe className="w-4 h-4 animate-spin" />
            Testando...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Testar Conexão
          </>
        )}
      </Button>

      {value && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Última resposta:
          </p>
          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
