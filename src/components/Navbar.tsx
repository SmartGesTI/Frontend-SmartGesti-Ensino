import { SchoolSelector } from '@/components/SchoolSelector'
import { UserDropdown } from '@/components/UserDropdown'
import { NotificationBell } from '@/components/NotificationBell'
import { HelpButton } from '@/components/HelpButton'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Input } from '@/components/ui/input'
import { Search, Building2, Sun, Moon, Bell, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useHelpHighlight, highlightClasses } from '@/contexts/HelpHighlightContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const { highlightedElement } = useHelpHighlight()
  const { isExpanded, toggleSidebar } = useSidebar()

  return (
    <header className={cn(
      'h-16 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md',
      'sticky top-0 z-40 transition-all duration-200',
      className
    )}>
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Lado Esquerdo - Botão Toggle + Busca */}
        <div className="flex items-center gap-3 flex-1">
          {/* Botão Toggle Sidebar */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'hidden lg:flex items-center justify-center w-10 h-10 rounded-lg',
              'text-gray-500 dark:text-gray-400',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'hover:text-gray-700 dark:hover:text-gray-200',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
            )}
            aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
          >
            {isExpanded ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </button>

          {/* Barra de Busca */}
          <div className="flex-1 max-w-xl hidden md:block">
          <div className={cn(
            'relative transition-all duration-200',
            searchFocused && 'scale-[1.02]'
          )}>
            <Search className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200',
              searchFocused 
                ? 'text-blue-500' 
                : 'text-gray-400 dark:text-gray-500'
            )} />
            <Input
              type="search"
              placeholder="Buscar alunos, turmas, documentos..."
              className={cn(
                'pl-10 pr-4 h-10 w-full rounded-full',
                'bg-gray-100 dark:bg-gray-800 border-transparent',
                'focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500',
                'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                'transition-all duration-200'
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          </div>
        </div>

        {/* Lado Direito - Seletor + Ações */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Help Button */}
          <HelpButton
            title="Central de Ajuda"
            description="Saiba como utilizar os recursos do sistema"
            size="md"
            belowNavbar
            items={[
              {
                title: 'Seletor de Escola',
                description: 'Alterne entre as escolas que você tem acesso. Ao trocar de escola, o sistema recarregará automaticamente com os dados da escola selecionada. Você só poderá visualizar e gerenciar os dados da escola ativa no momento.',
                icon: <Building2 className="w-4 h-4" />,
                iconColor: 'blue',
                highlightTarget: 'school-selector',
              },
              {
                title: 'Central de Notificações',
                description: 'Acompanhe avisos importantes, atualizações do sistema e alertas. O badge vermelho indica quantas notificações não lidas você tem. Clique para visualizar detalhes e marcar como lidas.',
                icon: <Bell className="w-4 h-4" />,
                iconColor: 'rose',
                highlightTarget: 'notifications',
              },
              {
                title: 'Tema de Cores',
                description: 'Personalize a aparência do sistema. Escolha entre tema Claro (sol), Escuro (lua) ou Automático (segue as configurações do seu dispositivo). Sua preferência é salva automaticamente.',
                icon: (
                  <div className="relative w-4 h-4">
                    <Sun className="w-4 h-4 absolute dark:opacity-0" />
                    <Moon className="w-4 h-4 absolute opacity-0 dark:opacity-100" />
                  </div>
                ),
                iconColor: 'amber',
                highlightTarget: 'theme-toggle',
              },
              {
                title: 'Menu do Usuário',
                description: 'Acesse seu perfil para atualizar dados pessoais, configurações da conta, preferências de notificação e a opção de sair do sistema com segurança.',
                icon: (
                  <Avatar className="w-4 h-4">
                    <AvatarFallback className="bg-transparent text-white text-[8px] font-semibold">
                      U
                    </AvatarFallback>
                  </Avatar>
                ),
                iconColor: 'purple',
                highlightTarget: 'user-menu',
              },
            ]}
          />

          {/* School Selector */}
          <div className={cn(
            'hidden lg:block',
            highlightClasses.base,
            highlightedElement === 'school-selector' && highlightClasses.active
          )}>
            <SchoolSelector />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

          {/* Notifications */}
          <div className={cn(
            highlightClasses.base,
            highlightedElement === 'notifications' && highlightClasses.active
          )}>
            <NotificationBell />
          </div>

          {/* Theme Toggle */}
          <div className={cn(
            highlightClasses.base,
            highlightedElement === 'theme-toggle' && highlightClasses.active
          )}>
            <ThemeToggle />
          </div>

          {/* User Dropdown */}
          <div className={cn(
            highlightClasses.base,
            highlightedElement === 'user-menu' && highlightClasses.active
          )}>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}
