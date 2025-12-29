import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Wand2, Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RelatorioForm } from './components/RelatorioForm'
import { RelatorioPreview } from './components/RelatorioPreview'
import { relatorioTipos, RelatorioTipo } from './components/mockData'
import { cn } from '@/lib/utils'

export default function RelatorioInteligente() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedTipo, setSelectedTipo] = useState<RelatorioTipo | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleSelectTipo = (tipo: RelatorioTipo) => {
    setSelectedTipo(tipo)
    // Inicializar valores padrão
    const defaultValues: Record<string, any> = {}
    tipo.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue
      }
    })
    setFormValues(defaultValues)
    setIsGenerated(false)
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsGenerated(false)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simular geração de relatório
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 2000)
  }

  const handleDownload = () => {
    // TODO: Implementar download real
    console.log('Downloading report...', { tipo: selectedTipo, values: formValues })
  }

  return (
    <div className="space-y-6">
      {!selectedTipo ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Selecione o tipo de relatório
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatorioTipos.map((tipo) => {
              const Icon = tipo.icon
              return (
                <Card
                  key={tipo.id}
                  onClick={() => handleSelectTipo(tipo)}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-gray-200 dark:border-gray-700"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                          tipo.color === 'purple' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                          tipo.color === 'emerald' && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                          tipo.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                          tipo.color === 'amber' && 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{tipo.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {tipo.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <Card className="shadow-2xl border-2 border-border bg-card">
            <CardHeader className="bg-gradient-to-b from-cyan-50/50 to-transparent dark:from-cyan-950/30 dark:to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Configuração
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTipo(null)
                    setFormValues({})
                    setIsGenerated(false)
                  }}
                  className="text-xs"
                >
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <RelatorioForm
                tipo={selectedTipo}
                values={formValues}
                onChange={handleFieldChange}
              />
              <div className="mt-6 flex gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Gerar Relatório
                    </>
                  )}
                </Button>
                {isGenerated && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <div>
            <RelatorioPreview tipo={selectedTipo} values={formValues} />
            {isGenerated && (
              <Card className="mt-4 border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span className="font-semibold">Relatório gerado com sucesso!</span>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                    Seu relatório está pronto para download.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
