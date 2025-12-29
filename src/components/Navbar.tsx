import { SchoolSelector } from '@/components/SchoolSelector'
import { UserDropdown } from '@/components/UserDropdown'
import { NotificationBell } from '@/components/NotificationBell'
import { HelpButton } from '@/components/HelpButton'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { CustomNavbarDropdown } from '@/components/CustomNavbarDropdown'
import { EducAIAContent } from '@/components/EducAIAContent'
import { SearchContent } from '@/components/SearchContent'
import { useHelpPanel } from '@/contexts/HelpPanelContext'
import { Search, Building2, Sun, Moon, Bell, PanelLeftClose, PanelLeft, Sparkles } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useHelpHighlight, highlightClasses } from '@/contexts/HelpHighlightContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const searchInputRef = useRef<HTMLButtonElement>(null)
  const { openPanel, closePanel } = useHelpPanel()
  const { highlightedElement } = useHelpHighlight()
  const { isExpanded, toggleSidebar } = useSidebar()
  const isTogglingRef = useRef(false)

  const handleEducaIAClick = () => {
    openPanel({
      title: 'EducaIA',
      description: 'Central de Inteligência Artificial',
      customContent: <EducAIAContent closePanel={closePanel} />,
      variant: 'custom',
      width: 'large'
    })
  }

  const handleSearchToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // Evitar múltiplos cliques rápidos
    if (isTogglingRef.current) {
      return
    }
    isTogglingRef.current = true
    
    if (searchDropdownOpen) {
      setSearchDropdownOpen(false)
    } else {
      setSearchDropdownOpen(true)
    }
    
    // Resetar flag após um delay maior para evitar cliques durante animação
    setTimeout(() => {
      isTogglingRef.current = false
    }, 400) // Tempo maior que a animação (350ms)
  }, [searchDropdownOpen])

  const handleSearchClose = useCallback(() => {
    if (isTogglingRef.current) {
      return
    }
    isTogglingRef.current = true
    setSearchDropdownOpen(false)
    // Resetar flag após um delay maior para evitar cliques durante animação
    setTimeout(() => {
      isTogglingRef.current = false
    }, 400) // Tempo maior que a animação (350ms)
  }, [])


  return (
    <header className={cn(
      'h-16 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md',
      'sticky top-0 z-40 transition-all duration-200',
      className
    )}>
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4 relative">
        {/* Lado Esquerdo - Botão Toggle */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Botão Toggle Sidebar */}
          <div className={cn(
            'hidden lg:block',
            highlightClasses.base,
            highlightedElement === 'sidebar-toggle' && highlightClasses.active
          )}>
            <button
              onClick={toggleSidebar}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg',
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
          </div>
        </div>

        {/* Botão de Busca Centralizado */}
        <div className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-auto',
          highlightClasses.base,
          highlightedElement === 'search-bar' && highlightClasses.active
        )}>
          <button
            ref={searchInputRef}
            onClick={handleSearchToggle}
            className={cn(
              'flex items-center gap-2 rounded-lg',
              'text-gray-500 dark:text-gray-400',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'hover:text-gray-700 dark:hover:text-gray-200',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              searchDropdownOpen 
                ? 'bg-gray-100 dark:bg-gray-800 text-blue-500 dark:text-blue-400 px-4 h-10' 
                : 'w-10 h-10 justify-center'
            )}
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 flex-shrink-0" />
            {searchDropdownOpen && (
              <span className="text-sm font-medium whitespace-nowrap">Buscando</span>
            )}
          </button>
            <CustomNavbarDropdown
              isOpen={searchDropdownOpen}
              onClose={handleSearchClose}
              triggerRef={searchInputRef as React.RefObject<HTMLElement>}
              position="center"
              width="w-[40vw]"
              maxWidth="max-w-[90vw]"
              maxHeight="max-h-[70vh]"
            >
              <SearchContent onClose={handleSearchClose} />
            </CustomNavbarDropdown>
        </div>

        {/* Lado Direito - EducaIA + Seletor + Ações */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Botão EducaIA */}
          <button
            onClick={handleEducaIAClick}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl',
              'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
              'text-white shadow-lg shadow-purple-500/30',
              'hover:shadow-purple-500/50 hover:scale-105',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
              'cursor-pointer'
            )}
            aria-label="Abrir EducaIA"
          >
            <Sparkles className="w-5 h-5 animate-bounce" />
          </button>

          {/* Help Button */}
          <HelpButton
            title="Central de Ajuda"
            description="Saiba como utilizar os recursos do sistema"
            size="md"
            items={[
              {
                title: 'Expandir/Recolher Menu',
                description: 'Clique para expandir ou recolher o menu lateral. Quando recolhido, passe o mouse sobre os ícones para ver as opções. Sua preferência é salva automaticamente.',
                icon: (
                  <div className="relative w-4 h-4">
                    <PanelLeftClose className="w-4 h-4 absolute" style={{ opacity: isExpanded ? 1 : 0 }} />
                    <PanelLeft className="w-4 h-4 absolute" style={{ opacity: isExpanded ? 0 : 1 }} />
                  </div>
                ),
                iconColor: 'indigo',
                highlightTarget: 'sidebar-toggle',
              },
              {
                title: 'Campo de Busca',
                description: 'Pesquise rapidamente por alunos, turmas, documentos e outros registros. Digite o termo desejado e os resultados aparecerão instantaneamente.',
                icon: <Search className="w-4 h-4" />,
                iconColor: 'cyan',
                highlightTarget: 'search-bar',
              },
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
