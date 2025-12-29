import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Shield,
  Users,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Crown,
  UserCog,
  GraduationCap,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// Dados mockados de cargos e permissões
const mockRoles = [
  {
    id: '1',
    name: 'Owner',
    slug: 'owner',
    description: 'Proprietário da instituição com acesso total',
    usersCount: 1,
    isSystem: true,
    icon: Crown,
    color: 'text-amber-500',
    permissions: { schools: ['*'], users: ['*'], students: ['*'], reports: ['*'], settings: ['*'] },
  },
  {
    id: '2',
    name: 'Administrador',
    slug: 'admin',
    description: 'Acesso administrativo completo',
    usersCount: 3,
    isSystem: true,
    icon: UserCog,
    color: 'text-blue-500',
    permissions: { schools: ['read', 'update'], users: ['*'], students: ['*'], reports: ['read'], settings: ['read'] },
  },
  {
    id: '3',
    name: 'Coordenador',
    slug: 'coordinator',
    description: 'Gerencia turmas e alunos',
    usersCount: 5,
    isSystem: false,
    icon: GraduationCap,
    color: 'text-purple-500',
    permissions: { schools: ['read'], users: ['read'], students: ['*'], reports: ['read'], settings: [] },
  },
  {
    id: '4',
    name: 'Professor',
    slug: 'teacher',
    description: 'Acesso às turmas e notas',
    usersCount: 28,
    isSystem: false,
    icon: BookOpen,
    color: 'text-emerald-500',
    permissions: { schools: ['read'], users: [], students: ['read', 'update'], reports: ['read'], settings: [] },
  },
  {
    id: '5',
    name: 'Secretário',
    slug: 'secretary',
    description: 'Atendimento e matrículas',
    usersCount: 8,
    isSystem: false,
    icon: Users,
    color: 'text-cyan-500',
    permissions: { schools: ['read'], users: ['read'], students: ['read', 'create', 'update'], reports: [], settings: [] },
  },
]

const resources = [
  { key: 'schools', label: 'Escolas', description: 'Gerenciar escolas da instituição' },
  { key: 'users', label: 'Usuários', description: 'Gerenciar usuários e convites' },
  { key: 'students', label: 'Alunos', description: 'Gerenciar alunos e matrículas' },
  { key: 'reports', label: 'Relatórios', description: 'Acessar relatórios e estatísticas' },
  { key: 'settings', label: 'Configurações', description: 'Alterar configurações do sistema' },
]

const actions = ['read', 'create', 'update', 'delete']

export function PermissoesTab() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const getPermissionBadge = (permissions: string[]) => {
    if (permissions.includes('*')) {
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Total</Badge>
    }
    if (permissions.length === 0) {
      return <Badge variant="outline" className="text-gray-500">Nenhum</Badge>
    }
    return <Badge variant="outline">{permissions.length} ações</Badge>
  }

  const selectedRoleData = mockRoles.find(r => r.id === selectedRole)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Shield className="h-5 w-5" />
                Cargos e Permissões
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                Gerencie os cargos e permissões padrão da instituição
              </CardDescription>
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cargo
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lista de Cargos */}
        <Card className="border-2 border-border">
          <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
            <CardTitle className="text-base text-blue-600 dark:text-blue-400">Cargos</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Selecione um cargo para ver e editar suas permissões</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockRoles.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left',
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                  )}
                >
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800', role.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.name}</span>
                      {role.isSystem && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">Sistema</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{role.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {role.usersCount} {role.usersCount === 1 ? 'usuário' : 'usuários'}
                    </Badge>
                    <ChevronRight className={cn('h-4 w-4 text-gray-400 transition-transform', isSelected && 'rotate-90')} />
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Detalhes do Cargo */}
        <Card className="border-2 border-border">
          <CardHeader className="bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-border">
            <CardTitle className="text-base text-amber-600 dark:text-amber-400">
              {selectedRoleData ? `Permissões: ${selectedRoleData.name}` : 'Selecione um Cargo'}
            </CardTitle>
            {selectedRoleData && (
              <CardDescription className="text-gray-600 dark:text-gray-400">{selectedRoleData.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedRoleData ? (
              <div className="space-y-4">
                {resources.map((resource) => {
                  const rolePermissions = selectedRoleData.permissions[resource.key as keyof typeof selectedRoleData.permissions] || []
                  const hasFullAccess = rolePermissions.includes('*')
                  
                  return (
                    <div key={resource.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{resource.label}</p>
                          <p className="text-xs text-muted-foreground">{resource.description}</p>
                        </div>
                        {getPermissionBadge(rolePermissions)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action) => {
                          const hasPermission = hasFullAccess || rolePermissions.includes(action)
                          return (
                            <div key={action} className="flex items-center gap-2">
                              <Switch 
                                checked={hasPermission} 
                                disabled={selectedRoleData.isSystem}
                                className="scale-75"
                              />
                              <span className={cn(
                                'text-xs capitalize',
                                hasPermission ? 'text-foreground' : 'text-muted-foreground'
                              )}>
                                {action === 'read' && 'Ler'}
                                {action === 'create' && 'Criar'}
                                {action === 'update' && 'Editar'}
                                {action === 'delete' && 'Excluir'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

                {!selectedRoleData.isSystem && (
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                )}

                {selectedRoleData.isSystem && (
                  <p className="text-xs text-muted-foreground text-center pt-4 border-t">
                    Cargos do sistema não podem ser editados
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Selecione um cargo para ver suas permissões</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
