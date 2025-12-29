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
  ClipboardList,
  Eye,
  DollarSign,
  BarChart3,
  Globe,
  Layout,
  Sparkles,
  Bot,
  Wand2,
  MessageCircle,
  Crown,
  Zap,
  CalendarDays,
  ClipboardCheck,
  RefreshCw,
  Grid3x3,
  UserCircle
} from 'lucide-react'
import { PermissionGate } from './PermissionGate'
import { usePermissions } from '../hooks/usePermissions'
import { useSchool } from '@/contexts/SchoolContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { useState, useEffect } from 'react'
import { routes } from '@/lib/routes'

interface MenuItem {
  name: string
  icon: React.ElementType
  iconColor?: string
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
  const { loading, isOwner } = usePermissions()
  const { school, isLoading: schoolLoading } = useSchool()
  const { isExpanded } = useSidebar()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

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

  const menuItems: MenuItem[] = slug ? [
    {
      name: 'EducaIA',
      icon: Sparkles,
      iconColor: 'text-purple-500',
      requirePermission: false,
      children: [
        {
          name: 'Assistente',
          icon: MessageCircle,
          iconColor: 'text-purple-400',
          path: `/escola/${slug}/ia/assistente`,
          requirePermission: false,
        },
        {
          name: 'Relatório Inteligente',
          icon: Wand2,
          iconColor: 'text-purple-500',
          path: `/escola/${slug}/ia/relatorio`,
          requirePermission: false,
        },
        {
          name: 'Criar Agente IA',
          icon: Bot,
          iconColor: 'text-purple-600',
          path: `/escola/${slug}/ia/criar`,
          requirePermission: false,
        },
        {
          name: 'Ver Agentes',
          icon: Grid3x3,
          iconColor: 'text-purple-500',
          path: `/escola/${slug}/ia/agentes`,
          requirePermission: false,
        },
        {
          name: 'Meus Agentes',
          icon: UserCircle,
          iconColor: 'text-purple-400',
          path: `/escola/${slug}/ia/meus-agentes`,
          requirePermission: false,
        },
      ],
    },
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      iconColor: 'text-blue-500',
      requirePermission: false,
      children: [
        {
          name: 'Visão Geral',
          icon: Eye,
          iconColor: 'text-blue-400',
          path: routes.school.dashboard(slug),
          requirePermission: false,
        },
        {
          name: 'Financeiro',
          icon: DollarSign,
          iconColor: 'text-blue-500',
          path: routes.school.financial(slug),
          requirePermission: false,
        },
        {
          name: 'Acadêmico',
          icon: BarChart3,
          iconColor: 'text-blue-600',
          path: routes.school.academic(slug),
          requirePermission: false,
        },
      ],
    },
    {
      name: 'Administração',
      icon: Building2,
      iconColor: 'text-amber-500',
      requirePermission: true,
      resource: 'users',
      action: 'read',
      children: [
        {
          name: 'Gerenciar Escola',
          icon: School,
          iconColor: 'text-amber-400',
          path: routes.school.details(slug),
          requirePermission: false,
        },
        {
          name: 'Matrícula',
          icon: ClipboardCheck,
          iconColor: 'text-amber-500',
          path: `/escola/${slug}/matricula`,
          requirePermission: false,
        },
        {
          name: 'Rematrícula',
          icon: RefreshCw,
          iconColor: 'text-amber-500',
          path: `/escola/${slug}/rematricula`,
          requirePermission: false,
        },
        {
          name: 'Equipe',
          icon: UserCog,
          iconColor: 'text-amber-500',
          path: routes.school.users(slug),
          resource: 'users',
          action: 'read',
          requirePermission: true,
        },
        {
          name: 'Permissões',
          icon: Shield,
          iconColor: 'text-amber-600',
          path: routes.school.permissions(slug),
          resource: 'users',
          action: 'create',
          requirePermission: true,
        },
      ],
    },
    {
      name: 'Acadêmico',
      icon: GraduationCap,
      iconColor: 'text-purple-500',
      requirePermission: false,
      children: [
        {
          name: 'Turmas',
          icon: Users,
          iconColor: 'text-purple-400',
          path: routes.school.classes(slug),
          requirePermission: false,
        },
        {
          name: 'Alunos',
          icon: BookOpen,
          iconColor: 'text-purple-500',
          path: routes.school.students(slug),
          requirePermission: false,
        },
        {
          name: 'Matrículas',
          icon: ClipboardList,
          iconColor: 'text-purple-600',
          path: routes.school.enrollments(slug),
          requirePermission: false,
        },
      ],
    },
    {
      name: 'Calendário',
      icon: Calendar,
      iconColor: 'text-cyan-500',
      requirePermission: false,
      children: [
        {
          name: 'Ver Calendário',
          icon: Eye,
          iconColor: 'text-cyan-400',
          path: routes.school.calendar(slug),
          requirePermission: false,
        },
        {
          name: 'Novo Evento',
          icon: Plus,
          iconColor: 'text-cyan-600',
          path: routes.school.calendarNew(slug),
          requirePermission: false,
        },
      ],
    },
    {
      name: 'Criador de Sites',
      icon: Globe,
      iconColor: 'text-pink-500',
      requirePermission: false,
      children: [
        {
          name: 'Meus Sites',
          icon: Layout,
          iconColor: 'text-pink-400',
          path: `/escola/${slug}/sites`,
          requirePermission: false,
        },
        {
          name: 'Criar Novo',
          icon: Plus,
          iconColor: 'text-pink-600',
          path: `/escola/${slug}/sites/novo`,
          requirePermission: false,
        },
      ],
    },
    {
      name: 'Documentos',
      icon: FileText,
      iconColor: 'text-teal-500',
      path: routes.school.documents(slug),
      requirePermission: false,
    },
    {
      name: 'Configurações',
      icon: Settings,
      iconColor: 'text-red-500',
      path: routes.school.settings(slug),
      requirePermission: false,
    },
  ] : []

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const isActive = (path?: string, exactMatch: boolean = false) => {
    if (!path) return false
    // Para submenus (filhos), usar correspondência exata
    if (exactMatch) {
      return location.pathname === path
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const hasActiveChild = (item: MenuItem): boolean => {
    if (!item.children) return false
    return item.children.some(child => isActive(child.path, true))
  }

  // Renderizar menu no modo expandido
  const renderExpandedMenuItem = (item: MenuItem, depth: number = 0) => {
    const Icon = item.icon
    const isMenuExpanded = expandedMenus.includes(item.name)
    const hasChildren = item.children && item.children.length > 0
    // Para itens filhos (depth > 0), usar correspondência exata
    const itemActive = item.path ? isActive(item.path, depth > 0) : hasActiveChild(item)
    const isConfigMenu = item.name === 'Configurações'
    const isAIMenu = item.name === 'EducaIA'

    const menuContent = (
      <>
        {hasChildren ? (
          <button
            onClick={() => toggleMenu(item.name)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200',
              'group relative overflow-hidden',
              isAIMenu
                ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02]'
                : itemActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
              depth > 0 && 'ml-4'
            )}
          >
            {isAIMenu && (
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            <Icon className={cn(
              'w-[18px] h-[18px] transition-colors flex-shrink-0 relative z-10',
              isAIMenu ? 'text-white animate-bounce' : itemActive ? 'text-blue-600 dark:text-blue-400' : item.iconColor
            )} />
            <span className="font-medium flex-1 text-left text-[13px] relative z-10">{item.name}</span>
            {isAIMenu && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-semibold relative z-10">Beta</span>
            )}
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform duration-300 flex-shrink-0 relative z-10',
              isMenuExpanded && 'rotate-180'
            )} />
          </button>
        ) : (
          <Link
            to={item.path || '#'}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200',
              'group relative overflow-hidden',
              itemActive
                ? isConfigMenu
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : isConfigMenu
                  ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
              depth > 0 && 'ml-4'
            )}
          >
            <span className={cn(
              'absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 transition-opacity duration-200',
              'group-hover:opacity-100',
              itemActive && 'opacity-0'
            )} />
            <Icon className={cn(
              'w-[18px] h-[18px] transition-colors flex-shrink-0 relative z-10',
              depth > 0 && 'w-4 h-4',
              !itemActive && item.iconColor
            )} />
            <span className={cn(
              'font-medium relative z-10 text-[13px]',
              depth > 0 && 'text-[13px]'
            )}>{item.name}</span>
            {itemActive && depth === 0 && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
            )}
          </Link>
        )}

        {hasChildren && (
          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isMenuExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
          )}>
            <div className="pl-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
              {item.children!.map((child) => (
                <div key={child.name}>
                  {child.requirePermission && child.resource && child.action ? (
                    <PermissionGate resource={child.resource} action={child.action}>
                      {renderExpandedMenuItem(child, depth + 1)}
                    </PermissionGate>
                  ) : (
                    renderExpandedMenuItem(child, depth + 1)
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )

    if (depth === 0 && item.requirePermission && item.resource && item.action) {
      return (
        <PermissionGate key={item.name} resource={item.resource} action={item.action}>
          <div className={cn(isAIMenu && 'mb-3')}>{menuContent}</div>
        </PermissionGate>
      )
    }

    return <div key={item.name} className={cn(isAIMenu && 'mb-3')}>{menuContent}</div>
  }

  // Renderizar menu no modo colapsado (com tooltip/popover no hover)
  const renderCollapsedMenuItem = (item: MenuItem) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const itemActive = item.path ? isActive(item.path) : hasActiveChild(item)
    const isHovered = hoveredMenu === item.name
    const isConfigMenu = item.name === 'Configurações'
    const isAIMenu = item.name === 'EducaIA'

    const menuContent = (
      <div 
        className="relative"
        onMouseEnter={() => setHoveredMenu(item.name)}
        onMouseLeave={() => setHoveredMenu(null)}
      >
        {hasChildren ? (
          <button
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200',
              'group relative overflow-hidden',
              isAIMenu
                ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110'
                : itemActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            <Icon className={cn('w-[18px] h-[18px]', isAIMenu ? 'text-white animate-bounce' : !itemActive && item.iconColor)} />
          </button>
        ) : (
          <Link
            to={item.path || '#'}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200',
              'group relative',
              itemActive
                ? isConfigMenu
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : isConfigMenu
                  ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            <Icon className={cn('w-[18px] h-[18px]', !itemActive && item.iconColor)} />
          </Link>
        )}

        {/* Popover no hover - com área de transição */}
        {isHovered && (
          <>
            {/* Área invisível para manter hover ao mover para o popover */}
            <div className="absolute left-full top-0 w-3 h-full" />
            <div 
              className={cn(
                'absolute left-full top-0 ml-3 z-[100]',
                'bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
                'min-w-[200px] py-2',
                'animate-in fade-in-0 slide-in-from-left-2 duration-200'
              )}
            >
              {hasChildren ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </span>
                  </div>
                  <div className="py-1">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon
                      const childActive = isActive(child.path, true)
                      
                      const childLink = (
                        <Link
                          key={child.name}
                          to={child.path || '#'}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2 mx-1 rounded-md transition-all duration-150',
                            childActive
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          )}
                        >
                          <ChildIcon className={cn('w-4 h-4', !childActive && child.iconColor)} />
                          <span className="text-sm font-medium">{child.name}</span>
                        </Link>
                      )

                      if (child.requirePermission && child.resource && child.action) {
                        return (
                          <PermissionGate key={child.name} resource={child.resource} action={child.action}>
                            {childLink}
                          </PermissionGate>
                        )
                      }
                      return childLink
                    })}
                  </div>
                </>
              ) : (
                <div className="px-3 py-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )

    if (item.requirePermission && item.resource && item.action) {
      return (
        <PermissionGate key={item.name} resource={item.resource} action={item.action}>
          <div className={cn(isAIMenu && 'mb-1')}>{menuContent}</div>
        </PermissionGate>
      )
    }

    return <div key={item.name} className={cn(isAIMenu && 'mb-1')}>{menuContent}</div>
  }

  if (loading || schoolLoading) {
    return (
      <aside className={cn(
        'bg-card border-r border-gray-200 dark:border-gray-700',
        'flex-shrink-0 transition-all duration-300 relative z-30',
        isExpanded ? 'w-64' : 'w-[72px]',
        className
      )}>
        {/* Header skeleton */}
        <div className={cn(
          'h-16 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 flex-shrink-0',
          isExpanded ? 'px-4' : 'px-4 justify-center'
        )}>
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          {isExpanded && (
            <div className="flex-1">
              <div className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="w-16 h-3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mt-1" />
            </div>
          )}
        </div>
        <div className={cn('p-3 space-y-3', !isExpanded && 'flex flex-col items-center')}>
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className={cn(
                'bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse',
                isExpanded ? 'h-10 w-full' : 'h-10 w-10'
              )} 
            />
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className={cn(
      'bg-card border-r border-gray-200 dark:border-gray-700',
      'flex-shrink-0 flex flex-col transition-all duration-300 relative z-30',
      isExpanded ? 'w-64' : 'w-[72px]',
      className
    )}>
      {/* Header do Sidebar - Logo e Escola */}
      <div className={cn(
        'h-16 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 flex-shrink-0',
        isExpanded ? 'px-4' : 'px-4 justify-center'
      )}>
        {school?.logo_url ? (
          <img 
            src={school.logo_url} 
            alt={school.name} 
            className="w-10 h-10 rounded-lg object-contain bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        )}
        {isExpanded && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {school?.name || 'SmartGesti'}
            </span>
            {school?.code && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {school.code}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation - com scroll quando expandido, overflow visible quando colapsado */}
      <nav className={cn(
        'flex-1 p-3',
        isExpanded 
          ? 'overflow-y-auto space-y-1' 
          : 'overflow-visible flex flex-col items-center space-y-2'
      )}>
        {isExpanded 
          ? menuItems.map((item) => renderExpandedMenuItem(item))
          : menuItems.map((item) => renderCollapsedMenuItem(item))
        }
      </nav>

      {/* Card do Plano - apenas para Owner */}
      {isExpanded && isOwner && (
        <div className="px-3 pb-2 flex-shrink-0">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            {/* Header do Plano */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <Link 
                    to={`/escola/${slug}/planos`}
                    className="text-xs font-bold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Plano Pro
                  </Link>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <CalendarDays className="w-3 h-3" />
                    <span>Renova 15/01/2025</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Créditos de IA */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-500" />
                  Créditos de IA
                </span>
                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">7.500 / 10.000</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-500"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
            
            {/* Botão Upgrade */}
            <button className="w-full py-1.5 px-3 text-[11px] font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-purple-500/20">
              Fazer Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Footer do Sidebar */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
            SmartGesti Ensino v1.0
          </div>
        </div>
      )}
    </aside>
  )
}
