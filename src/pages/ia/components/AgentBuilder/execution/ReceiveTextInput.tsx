import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ReceiveTextInputProps {
  value?: string
  onChange: (value: string) => void
  required?: boolean
  error?: boolean
}

/**
 * Componente de entrada para receber texto
 */
export function ReceiveTextInput({ value = '', onChange, required = true, error: externalError }: ReceiveTextInputProps) {
  const [touched, setTouched] = useState(false)
  
  const isEmpty = !value.trim()
  const showError = (touched && isEmpty && required) || externalError

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Texto
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="Cole ou digite o texto aqui..."
        className={cn(
          "min-h-[120px] text-sm",
          showError && "border-red-500 focus-visible:ring-red-500"
        )}
      />
      <div className="flex justify-between items-center text-xs">
        {showError ? (
          <span className="text-red-500">Campo obrigatório</span>
        ) : (
          <span />
        )}
        <span className="text-gray-500 dark:text-gray-400">
          {value.length.toLocaleString()} caracteres
        </span>
      </div>
    </div>
  )
}
