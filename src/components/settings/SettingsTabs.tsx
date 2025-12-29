import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SettingsTabItem {
  value: string
  label: string
  icon: LucideIcon
  badge?: string
}

interface SettingsTabsProps {
  tabs: SettingsTabItem[]
  activeTab: string
  onTabChange: (value: string) => void
  children: ReactNode
  institutionName?: string
  institutionLogo?: string
}

/**
 * Componente de tabs verticais reutilizável para páginas de configurações
 * 
 * Desktop: Card sidebar esquerda com as abas
 * Mobile: Select dropdown no topo
 */
export function SettingsTabs({ tabs, activeTab, onTabChange, children, institutionName, institutionLogo }: SettingsTabsProps) {
  const activeTabData = tabs.find(t => t.value === activeTab)

  // Gerar iniciais do nome da instituição
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'IN'
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-10rem)]">
      {/* Mobile: Select dropdown */}
      <div className="md:hidden">
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            {/* Header Mobile */}
            <div className="flex items-center gap-3 mb-4">
              {institutionLogo ? (
                <img 
                  src={institutionLogo} 
                  alt={institutionName} 
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {getInitials(institutionName || 'Instituição')}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {institutionName || 'Instituição'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Configurações</p>
              </div>
            </div>
            <Select value={activeTab} onValueChange={onTabChange}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <SelectValue>
                  {activeTabData && (
                    <div className="flex items-center gap-2">
                      <activeTabData.icon className="h-4 w-4 text-blue-500" />
                      <span>{activeTabData.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    <div className="flex items-center gap-2">
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Desktop: Card Sidebar */}
      <aside className="hidden md:block w-60 shrink-0">
        <Card className="sticky top-4 border-2 border-border">
          {/* Header com Perfil da Instituição */}
          <div className="p-4 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
            <div className="flex items-center gap-3">
              {institutionLogo ? (
                <img 
                  src={institutionLogo} 
                  alt={institutionName} 
                  className="h-12 w-12 rounded-xl object-cover shadow-md"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {getInitials(institutionName || 'Instituição')}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm">
                  {institutionName || 'Instituição'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Configurações da Instituição</p>
              </div>
            </div>
          </div>

          {/* Menu de Navegação */}
          <CardContent className="p-2">
            <nav className="space-y-0.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value
                return (
                  <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive && [
                        'bg-blue-500 text-white shadow-md shadow-blue-500/20',
                      ],
                      !isActive && 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    )}
                  >
                    <tab.icon className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-white' : 'text-gray-500 dark:text-gray-500'
                    )} />
                    <span className="flex-1 text-left">{tab.label}</span>
                    {tab.badge && (
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded font-medium',
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>
      </aside>

      {/* Content area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
