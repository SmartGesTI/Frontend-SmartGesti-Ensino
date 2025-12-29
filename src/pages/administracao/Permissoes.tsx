import { useParams } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Permissoes() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl border-2 border-border bg-card">
        <CardHeader className="bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent">
          <CardTitle className="text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Controle de Permissões
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Gerenciamento de Permissões em Desenvolvimento
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Esta funcionalidade está sendo desenvolvida. Em breve você poderá gerenciar permissões e acessos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
