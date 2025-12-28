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
import { HelpButton } from '@/components/HelpButton'
import { Building2, Hash, FileText, Image, AlignLeft } from 'lucide-react'

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
          <div className="flex items-center gap-2">
            <CardTitle className="text-blue-600 dark:text-blue-400">Informações da Escola</CardTitle>
            <HelpButton
              title="Dados Gerais da Escola"
              description="Entenda cada campo do formulário"
              size="sm"
              items={[
                {
                  title: 'Nome da Escola',
                  description: 'Nome oficial da instituição de ensino. Este nome aparecerá em todos os documentos e relatórios gerados pelo sistema.',
                  icon: <Building2 className="w-4 h-4" />,
                  iconColor: 'blue',
                  highlightTarget: 'field-name',
                },
                {
                  title: 'Código',
                  description: 'Código interno para identificação rápida da escola. Pode ser usado em relatórios e integrações com outros sistemas.',
                  icon: <Hash className="w-4 h-4" />,
                  iconColor: 'purple',
                  highlightTarget: 'field-code',
                },
                {
                  title: 'CNPJ',
                  description: 'Cadastro Nacional de Pessoa Jurídica da escola. Formato: 00.000.000/0000-00. Essencial para emissão de notas fiscais e documentos legais.',
                  icon: <FileText className="w-4 h-4" />,
                  iconColor: 'emerald',
                  highlightTarget: 'field-cnpj',
                },
                {
                  title: 'URL da Logo',
                  description: 'Endereço web da imagem do logotipo da escola. A logo aparecerá no menu lateral, relatórios e documentos. Use uma imagem quadrada para melhor visualização.',
                  icon: <Image className="w-4 h-4" />,
                  iconColor: 'amber',
                  highlightTarget: 'field-logo',
                },
                {
                  title: 'Descrição',
                  description: 'Texto descritivo sobre a escola. Inclua missão, valores, metodologia de ensino e diferenciais. Este texto pode ser usado em materiais de divulgação.',
                  icon: <AlignLeft className="w-4 h-4" />,
                  iconColor: 'cyan',
                  highlightTarget: 'field-descricao',
                },
              ]}
            />
          </div>
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
