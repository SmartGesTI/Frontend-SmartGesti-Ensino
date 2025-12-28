import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSchool } from '@/contexts/SchoolContext'
import { DadosGeraisTab } from '@/components/school-tabs/DadosGeraisTab'
import { ContatosTab } from '@/components/school-tabs/ContatosTab'
import { EnderecoTab } from '@/components/school-tabs/EnderecoTab'
import { RedesSociaisTab } from '@/components/school-tabs/RedesSociaisTab'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function SchoolDetails() {
  const { school, isLoading, error } = useSchool()
  const navigate = useNavigate()

  // Redirecionar se não houver escola
  useEffect(() => {
    if (!isLoading && !school && !error) {
      navigate('/selecionar-escola', { replace: true })
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
          <CardTitle>Erro</CardTitle>
          <CardDescription>Não foi possível carregar os dados da escola</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error?.message || 'Escola não encontrada'}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{school.name}</h2>
        <p className="text-muted-foreground">
          Gerencie as informações da escola atual
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Escola</CardTitle>
          <CardDescription>
            Atualize os dados da escola em cada aba abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dados-gerais" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
              <TabsTrigger value="contatos">Contatos</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="redes-sociais">Redes Sociais</TabsTrigger>
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
