import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormField {
  name: string
  label: string
  type?: 'text' | 'email' | 'number' | 'date' | 'textarea'
  required?: boolean
}

interface ReceiveFormInputProps {
  value?: Record<string, any>
  onChange: (value: Record<string, any>) => void
  fields?: FormField[]
}

/**
 * Componente de entrada para receber dados de formulário
 */
export function ReceiveFormInput({ value = {}, onChange, fields = [] }: ReceiveFormInputProps) {
  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    onChange({
      ...value,
      [fieldName]: fieldValue,
    })
  }

  // Se não houver campos definidos, criar campos padrão
  const formFields: FormField[] = fields.length > 0 
    ? fields 
    : [
        { name: 'name', label: 'Nome', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'message', label: 'Mensagem', type: 'textarea' },
      ]

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Dados do Formulário</Label>
      
      {formFields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label className="text-xs font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.type === 'textarea' ? (
            <textarea
              value={value[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={`Digite ${field.label.toLowerCase()}...`}
              className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={field.required}
            />
          ) : (
            <Input
              type={field.type || 'text'}
              value={value[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={`Digite ${field.label.toLowerCase()}...`}
              className="h-9 text-sm"
              required={field.required}
            />
          )}
        </div>
      ))}
    </div>
  )
}
