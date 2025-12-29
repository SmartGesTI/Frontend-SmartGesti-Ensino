import { Globe, Layout } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MeusSites() {

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl border-2 border-border bg-card">
        <CardHeader className="bg-gradient-to-b from-pink-50/50 to-transparent dark:from-pink-950/30 dark:to-transparent">
          <CardTitle className="text-pink-600 dark:text-pink-400 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Gerenciamento de Sites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-xl bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-4">
              <Layout className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Gerenciamento de Sites em Desenvolvimento
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Esta funcionalidade está sendo desenvolvida. Em breve você poderá gerenciar os sites da escola.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
