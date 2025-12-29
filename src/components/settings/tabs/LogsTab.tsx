import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Search,
  Filter,
  Download,
  User,
  Settings,
  UserPlus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Shield,
  School,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// Dados mockados de logs
const mockLogs = [
  {
    id: '1',
    action: 'login',
    description: 'Login realizado com sucesso',
    user: 'Bruno Silva',
    email: 'bruno@smartgesti.edu.br',
    timestamp: '2024-12-28T14:30:00',
    ip: '192.168.1.100',
    type: 'auth',
  },
  {
    id: '2',
    action: 'create_invitation',
    description: 'Convite enviado para maria@escola.com',
    user: 'Bruno Silva',
    email: 'bruno@smartgesti.edu.br',
    timestamp: '2024-12-28T14:25:00',
    ip: '192.168.1.100',
    type: 'user',
  },
  {
    id: '3',
    action: 'update_school',
    description: 'Escola "Unidade Centro" atualizada',
    user: 'Ana Costa',
    email: 'ana@smartgesti.edu.br',
    timestamp: '2024-12-28T13:45:00',
    ip: '192.168.1.101',
    type: 'school',
  },
  {
    id: '4',
    action: 'update_permissions',
    description: 'Permissões do cargo "Coordenador" alteradas',
    user: 'Bruno Silva',
    email: 'bruno@smartgesti.edu.br',
    timestamp: '2024-12-28T12:30:00',
    ip: '192.168.1.100',
    type: 'settings',
  },
  {
    id: '5',
    action: 'delete_user',
    description: 'Usuário "Carlos Mendes" removido',
    user: 'Bruno Silva',
    email: 'bruno@smartgesti.edu.br',
    timestamp: '2024-12-28T11:15:00',
    ip: '192.168.1.100',
    type: 'user',
  },
  {
    id: '6',
    action: 'logout',
    description: 'Sessão encerrada',
    user: 'Maria Santos',
    email: 'maria@smartgesti.edu.br',
    timestamp: '2024-12-28T10:00:00',
    ip: '192.168.1.102',
    type: 'auth',
  },
  {
    id: '7',
    action: 'create_school',
    description: 'Nova escola "Unidade Norte" criada',
    user: 'Bruno Silva',
    email: 'bruno@smartgesti.edu.br',
    timestamp: '2024-12-27T16:45:00',
    ip: '192.168.1.100',
    type: 'school',
  },
  {
    id: '8',
    action: 'update_settings',
    description: 'Configurações da instituição atualizadas',
    user: 'Bruno Silva',
    email: 'bruno@smartgesti.edu.br',
    timestamp: '2024-12-27T15:30:00',
    ip: '192.168.1.100',
    type: 'settings',
  },
]

const actionIcons: Record<string, typeof User> = {
  login: LogIn,
  logout: LogOut,
  create_invitation: UserPlus,
  update_school: School,
  update_permissions: Shield,
  delete_user: Trash2,
  create_school: School,
  update_settings: Settings,
}

const actionColors: Record<string, string> = {
  login: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  logout: 'text-gray-500 bg-gray-50 dark:bg-gray-800',
  create_invitation: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  update_school: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  update_permissions: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
  delete_user: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  create_school: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
  update_settings: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
}

const typeLabels: Record<string, string> = {
  auth: 'Autenticação',
  user: 'Usuários',
  school: 'Escolas',
  settings: 'Configurações',
}

const typeBadgeColors: Record<string, string> = {
  auth: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  school: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  settings: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export function LogsTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || log.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <FileText className="h-5 w-5" />
                Logs de Atividade
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                Histórico de todas as ações realizadas na plataforma
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="auth">Autenticação</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
                <SelectItem value="school">Escolas</SelectItem>
                <SelectItem value="settings">Configurações</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card className="border-2 border-border">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum log encontrado</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const Icon = actionIcons[log.action] || Edit
                const iconColor = actionColors[log.action] || 'text-gray-500 bg-gray-50'
                
                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', iconColor)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{log.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{log.user}</span>
                            <span>•</span>
                            <span>{log.email}</span>
                          </div>
                        </div>
                        <Badge className={cn('shrink-0', typeBadgeColors[log.type])}>
                          {typeLabels[log.type]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{formatDate(log.timestamp)}</span>
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredLogs.length} de {mockLogs.length} registros
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="border-gray-300 dark:border-gray-600">
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled className="border-gray-300 dark:border-gray-600">
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
