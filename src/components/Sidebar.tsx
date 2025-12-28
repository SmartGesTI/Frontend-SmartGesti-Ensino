import { Link, useLocation, useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Home, School, Plus, Shield } from 'lucide-react'
import { PermissionGate } from './PermissionGate'
import { usePermissions } from '../hooks/usePermissions'

export function Sidebar() {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const { loading } = usePermissions()

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: `/escola/${slug}/painel`,
      active: location.pathname === `/escola/${slug}/painel`,
      requirePermission: false, // Todos podem ver o dashboard
    },
    {
      name: 'Gerenciar Escola',
      icon: School,
      path: `/escola/${slug}/escola-atual`,
      active: location.pathname === `/escola/${slug}/escola-atual`,
      requirePermission: false, // Todos podem ver a escola atual
    },
    {
      name: 'Nova Escola',
      icon: Plus,
      path: `/escola/${slug}/nova-escola`,
      active: location.pathname === `/escola/${slug}/nova-escola`,
      resource: 'schools',
      action: 'create',
      requirePermission: true, // Apenas quem pode criar escolas
    },
    {
      name: 'Gerenciar Permissões',
      icon: Shield,
      path: `/escola/${slug}/permissoes`,
      active: location.pathname === `/escola/${slug}/permissoes`,
      resource: 'users',
      action: 'create',
      requirePermission: true, // Apenas quem pode criar usuários
    },
  ]

  if (loading) {
    return (
      <aside className="w-64 bg-card border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-card border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          
          // Se não requer permissão, mostrar sempre
          if (!item.requirePermission) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  item.active
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          }

          // Se requer permissão, usar PermissionGate
          return (
            <PermissionGate
              key={item.path}
              resource={item.resource!}
              action={item.action!}
            >
              <Link
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  item.active
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </PermissionGate>
          )
        })}
      </nav>
    </aside>
  )
}
