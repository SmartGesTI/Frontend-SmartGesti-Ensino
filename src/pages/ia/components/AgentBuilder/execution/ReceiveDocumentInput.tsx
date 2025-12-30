import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'
import { ErrorLogger } from '@/lib/errorLogger'

interface ReceiveDocumentInputProps {
  value?: File | null
  onChange: (value: File | null) => void
  acceptedFormats?: string[]
  maxSize?: string
  multiple?: boolean
}

/**
 * Componente de entrada para upload de documentos
 */
export function ReceiveDocumentInput({ 
  value, 
  onChange, 
  acceptedFormats = ['pdf', 'docx', 'xlsx'],
  maxSize = '10MB',
  multiple = false
}: ReceiveDocumentInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseMaxSize = (sizeStr: string): number => {
    const match = sizeStr.match(/(\d+)(MB|KB|GB)/i)
    if (!match) return 10 * 1024 * 1024 // Default 10MB
    
    const [, num, unit] = match
    const number = parseInt(num, 10)
    
    switch (unit.toUpperCase()) {
      case 'KB': return number * 1024
      case 'MB': return number * 1024 * 1024
      case 'GB': return number * 1024 * 1024 * 1024
      default: return number * 1024 * 1024
    }
  }

  const maxSizeBytes = parseMaxSize(maxSize)
  const acceptedExtensions = acceptedFormats.map(f => f.toLowerCase())

  const validateFile = (file: File): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    if (!extension || !acceptedExtensions.includes(extension)) {
      ErrorLogger.logError(
        new Error(`Formato não aceito. Formatos aceitos: ${acceptedFormats.join(', ')}`),
        'ReceiveDocumentInput'
      )
      return false
    }

    if (file.size > maxSizeBytes) {
      ErrorLogger.logError(
        new Error(`Arquivo muito grande. Tamanho máximo: ${maxSize}`),
        'ReceiveDocumentInput'
      )
      return false
    }

    return true
  }

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onChange(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      if (multiple) {
        // Para múltiplos arquivos, validar todos e chamar onChange com o primeiro
        // (o componente pai gerencia a lista completa)
        const validFiles = files.filter(validateFile)
        if (validFiles.length > 0) {
          handleFileSelect(validFiles[0])
        }
      } else {
        handleFileSelect(files[0])
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Documento</Label>
      
      {value ? (
        <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 bg-emerald-50 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 truncate">
                  {value.name}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  {formatFileSize(value.size)}
                </p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(null)}
              className="h-8 w-8 p-0 ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            }
          `}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {multiple 
              ? 'Clique para enviar múltiplos arquivos ou arraste e solte'
              : 'Arraste um arquivo aqui ou clique para selecionar'
            }
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Formatos: {acceptedFormats.join(', ').toUpperCase()} • Máximo: {maxSize}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.map(f => `.${f}`).join(',')}
            onChange={handleFileInputChange}
            multiple={multiple}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3"
          >
            {multiple ? 'Selecionar Arquivos' : 'Selecionar Arquivo'}
          </Button>
        </div>
      )}
    </div>
  )
}
