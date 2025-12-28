import { Link, useLocation, useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  School, 
  Plus, 
  Shield, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings,
  ChevronDown,
  LayoutDashboard,
  GraduationCap,
  Building2,
  UserCog,
  ClipboardList
} from 'lucide-react'
import { PermissionGate } from './PermissionGate'
import { usePermissions } from '../hooks/usePermissions'
import { useState, useEffect } from 'react'

interface MenuItem {
  name: string
  icon: React.ElementType
  path?: string
  children?: MenuItem[]
  resource?: string
  action?: string
  requirePermission?: boolean
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const { loading } = usePermissions()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // Expandir menu pai automaticamente se um filho estiver ativo
  useEffect(() => {
    const currentPath = location.pathname
    menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          child.path && currentPath.startsWith(child.path)
        )
        if (hasActiveChild && !expandedMenus.includes(item.name)) {
          setExpandedMenus(prev => [...prev, item.name])
        }
      }
    })
  }, [location.pathname])

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: `/escola/${slug}/painel`,
      requirePermission: false,
    },
    {
      name: 'Acadêmico',
      icon: GraduationCap,
      requirePermission: false,
      children: [
        {
          name: 'Turmas',
          icon: Users,
          path: `/escola/${slug}/turmas`,
          requirePermission: false,
        },
        {
          name: 'Alunos',
          icon: BookOpen,
          path: `/escola/${slug}/alunos`,
          requirePermission: false,
        },
        {
          name: 'Matrículas',
          icon: ClipboardList,
          path: `/escola/${slug}/matriculas`,
          requirePermission: false,
        },
      ],
    },
    {
      name: 'Calendário',
      icon: Calendar,
      path: `/escola/${slug}/calendario`,
      requirePermission: false,
    },
    {
      name: 'Documentos',
      icon: FileText,
      path: `/escola/${slug}/documentos`,
      requirePermission: false,
    },
    {
      name: 'Administração',
      icon: Building2,
      requirePermission: true,
      resource: 'users',
      action: 'read',
      children: [
        {
          name: 'Gerenciar Escola',
          icon: School,
          path: `/escola/${slug}/escola-atual`,
          requirePermission: false,
        },
        {
          name: 'Nova Escola',
          icon: Plus,
          path: `/escola/${slug}/nova-escola`,
          resource: 'schools',
          action: 'create',
          requirePermission: true,
        },
        {
          name: 'Permissões',
          icon: Shield,
          path: `/escola/${slug}/permissoes`,
          resource: 'users',
          action: 'create',
          requirePermission: true,
        },
        {
          name: 'Usuários',
          icon: UserCog,
          path: `/escola/${slug}/usuarios`,
          resource: 'users',
          action: 'read',
          requirePermission: true,
        },
      ],
    },
    {
      name: 'Configurações',
      icon: Settings,
      path: `/escola/${slug}/configuracoes`,
      requirePermission: false,
    },
  ]

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const isActive = (path?: string) => {
    if (!path) return false
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const hasActiveChild = (item: MenuItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => isActive(child.path))
  }

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const Icon = item.icon
    const isExpanded = expandedMenus.includes(item.name)
    const hasChildren = item.children && item.children.length > 0
    const itemActive = item.path ? isActive(item.path) : hasActiveChild(item)

    const menuContent = (
      <>
        {hasChildren ? (
          // Menu com filhos - botão expansível
          <button
            onClick={() => toggleMenu(item.name)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              'group relative overflow-hidden',
              itemActive
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
              depth > 0 && 'ml-4'
            )}
          >
            <Icon className={cn(
              'w-5 h-5 transition-colors flex-shrink-0',
              itemActive && 'text-blue-600 dark:text-blue-400'
            )} />
            <span className="font-medium flex-1 text-left text-sm">{item.name}</span>
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform duration-300 flex-shrink-0',
              isExpanded && 'rotate-180'
            )} />
          </button>
        ) : (
          // Menu sem filhos - link direto
          <Link
            to={item.path || '#'}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              'group relative overflow-hidden',
              itemActive
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
              depth > 0 && 'ml-4 text-sm'
            )}
          >
            {/* Hover effect background */}
            <span className={cn(
              'absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 transition-opacity duration-200',
              'group-hover:opacity-100',
              itemActive && 'opacity-0'
            )} />
            <Icon className={cn(
              'w-5 h-5 transition-colors flex-shrink-0 relative z-10',
              depth > 0 && 'w-4 h-4'
            )} />
            <span className={cn(
              'font-medium relative z-10',
              depth > 0 && 'text-sm'
            )}>{item.name}</span>
            {/* Active indicator */}
            {itemActive && depth === 0 && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
            )}
          </Link>
        )}

        {/* Submenu com animação */}
        {hasChildren && (
          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
          )}>
            <div className="pl-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
              {item.children!.map((child) => (
                <div key={child.name}>
                  {child.requirePermission && child.resource && child.action ? (
                    <PermissionGate resource={child.resource} action={child.action}>
                      {renderMenuItem(child, depth + 1)}
                    </PermissionGate>
                  ) : (
                    renderMenuItem(child, depth + 1)
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )

    // Se o item pai requer permissão, envolver em PermissionGate
    if (depth === 0 && item.requirePermission && item.resource && item.action) {
      return (
        <PermissionGate key={item.name} resource={item.resource} action={item.action}>
          <div>{menuContent}</div>
        </PermissionGate>
      )
    }

    return <div key={item.name}>{menuContent}</div>
  }

  if (loading) {
    return (
      <aside className={cn(
        'w-64 bg-card border-r border-gray-200 dark:border-gray-700 p-4',
        'flex-shrink-0',
        className
      )}>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className={cn(
      'w-64 bg-card border-r border-gray-200 dark:border-gray-700',
      'flex-shrink-0 overflow-y-auto',
      className
    )}>
      {/* Header do Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Menu Principal
        </h2>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Footer do Sidebar */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
          SmartGesti Ensino v1.0
        </div>
      </div>
    </aside>
  )
}
