import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Save,
  Upload,
} from 'lucide-react'

// Dados mockados da instituição
const mockInstitution = {
  name: 'Instituto Educacional SmartGesti',
  tradeName: 'SmartGesti',
  cnpj: '12.345.678/0001-90',
  stateRegistration: '123.456.789.000',
  municipalRegistration: '987654321',
  email: 'contato@smartgesti.edu.br',
  phone: '(11) 3456-7890',
  whatsapp: '(11) 98765-4321',
  website: 'www.smartgesti.edu.br',
  address: {
    street: 'Av. Paulista',
    number: '1000',
    complement: 'Sala 1501',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
  },
  createdAt: '2024-01-15',
  plan: 'Profissional',
}

export function InstituicaoTab() {
  return (
    <div className="space-y-6">
      {/* Header com Logo */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                SG
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">{mockInstitution.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                    {mockInstitution.plan}
                  </Badge>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span>Desde {new Date(mockInstitution.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Upload className="h-4 w-4 mr-2" />
              Alterar Logo
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Dados Principais */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="text-base flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Building2 className="h-4 w-4" />
            Dados Principais
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Informações básicas da instituição</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Razão Social</Label>
            <Input id="name" defaultValue={mockInstitution.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tradeName">Nome Fantasia</Label>
            <Input id="tradeName" defaultValue={mockInstitution.tradeName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" defaultValue={mockInstitution.cnpj} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stateReg">Inscrição Estadual</Label>
            <Input id="stateReg" defaultValue={mockInstitution.stateRegistration} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="municipalReg">Inscrição Municipal</Label>
            <Input id="municipalReg" defaultValue={mockInstitution.municipalRegistration} />
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Phone className="h-4 w-4" />
            Contato
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Informações de contato da instituição</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              Email
            </Label>
            <Input id="email" type="email" defaultValue={mockInstitution.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              Telefone
            </Label>
            <Input id="phone" defaultValue={mockInstitution.phone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" defaultValue={mockInstitution.whatsapp} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" />
              Website
            </Label>
            <Input id="website" defaultValue={mockInstitution.website} />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
            <MapPin className="h-4 w-4" />
            Endereço
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Endereço da sede da instituição</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input id="zipCode" defaultValue={mockInstitution.address.zipCode} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="street">Logradouro</Label>
            <Input id="street" defaultValue={mockInstitution.address.street} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input id="number" defaultValue={mockInstitution.address.number} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" defaultValue={mockInstitution.address.complement} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" defaultValue={mockInstitution.address.neighborhood} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" defaultValue={mockInstitution.address.city} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input id="state" defaultValue={mockInstitution.address.state} />
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <FileText className="h-4 w-4" />
            Documentos
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Documentos da instituição (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Contrato Social</p>
              <Button variant="outline" size="sm" className="mt-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                Fazer Upload
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Alvará de Funcionamento</p>
              <Button variant="outline" size="sm" className="mt-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                Fazer Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
