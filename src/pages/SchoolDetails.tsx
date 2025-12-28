import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSchool } from '@/contexts/SchoolContext'
import { DadosGeraisTab } from '@/components/school-tabs/DadosGeraisTab'
import { ContatosTab } from '@/components/school-tabs/ContatosTab'
import { EnderecoTab } from '@/components/school-tabs/EnderecoTab'
import { RedesSociaisTab } from '@/components/school-tabs/RedesSociaisTab'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { routes } from '@/lib/routes'
import { useUrlTabs } from '@/hooks/useUrlTabs'

const SCHOOL_TABS = ['dados-gerais', 'contatos', 'endereco', 'redes-sociais'] as const

export default function SchoolDetails() {
  const { school, isLoading, error } = useSchool()
  const navigate = useNavigate()
  const { tabsProps } = useUrlTabs({ 
    defaultValue: 'dados-gerais',
    validValues: [...SCHOOL_TABS]
  })

  // Redirecionar se não houver escola
  useEffect(() => {
    if (!isLoading && !school && !error) {
      navigate(routes.selectSchool(), { replace: true })
    }
  }, [school, isLoading, error, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Erro</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Não foi possível carregar os dados da escola</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600 dark:text-red-400">{error?.message || 'Escola não encontrada'}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">{school.name}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie as informações da escola atual
        </p>
      </div>

      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="text-blue-600 dark:text-blue-400">Informações da Escola</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Atualize os dados da escola em cada aba abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs {...tabsProps} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 dark:bg-gray-800/50 p-1">
              <TabsTrigger value="dados-gerais" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Dados Gerais</TabsTrigger>
              <TabsTrigger value="contatos" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Contatos</TabsTrigger>
              <TabsTrigger value="endereco" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Endereço</TabsTrigger>
              <TabsTrigger value="redes-sociais" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Redes Sociais</TabsTrigger>
            </TabsList>

            <TabsContent value="dados-gerais" className="mt-6">
              <DadosGeraisTab school={school} />
            </TabsContent>

            <TabsContent value="contatos" className="mt-6">
              <ContatosTab school={school} />
            </TabsContent>

            <TabsContent value="endereco" className="mt-6">
              <EnderecoTab school={school} />
            </TabsContent>

            <TabsContent value="redes-sociais" className="mt-6">
              <RedesSociaisTab school={school} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
