import { RelatorioTipo, RelatorioField } from './mockData'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface RelatorioFormProps {
  tipo: RelatorioTipo
  values: Record<string, any>
  onChange: (field: string, value: any) => void
}

export function RelatorioForm({ tipo, values, onChange }: RelatorioFormProps) {
  const renderField = (field: RelatorioField) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            value={values[field.name] || field.defaultValue || ''}
            onValueChange={(value) => onChange(field.name, value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder={`Selecione ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'date':
        return (
          <Input
            type="date"
            value={values[field.name] || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="h-11"
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            value={values[field.name] || ''}
            onChange={(e) => onChange(field.name, Number(e.target.value))}
            className="h-11"
          />
        )

      case 'text':
        return (
          <Input
            type="text"
            value={values[field.name] || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="h-11"
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={values[field.name] ?? field.defaultValue ?? false}
              onCheckedChange={(checked) => onChange(field.name, checked)}
            />
            <Label className="text-sm text-gray-600 dark:text-gray-300">
              {field.label}
            </Label>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {tipo.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          {field.type !== 'checkbox' && (
            <Label required={field.required} className="text-sm font-medium">
              {field.label}
            </Label>
          )}
          {renderField(field)}
        </div>
      ))}
    </div>
  )
}
