import { useParams } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Documentos() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl border-2 border-border bg-card">
        <CardHeader className="bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-950/30 dark:to-transparent">
          <CardTitle className="text-teal-600 dark:text-teal-400 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Gerenciamento de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30 mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Gerenciamento de Documentos em Desenvolvimento
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Esta funcionalidade está sendo desenvolvida. Em breve você poderá gerenciar documentos e arquivos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
