import { useSchool } from '@/contexts/SchoolContext'
import { SchoolSelector } from '@/components/SchoolSelector'
import { UserDropdown } from '@/components/UserDropdown'
import { NotificationBell } from '@/components/NotificationBell'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Input } from '@/components/ui/input'
import { Search, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const { school, isLoading } = useSchool()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className={cn(
      'h-16 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md',
      'sticky top-0 z-40 transition-all duration-200',
      className
    )}>
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Lado Esquerdo - Logo/Nome da Escola */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="w-32 h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse hidden sm:block" />
            </div>
          ) : school ? (
            <div className="flex items-center gap-3">
              {school.logo_url ? (
                <img 
                  src={school.logo_url} 
                  alt={school.name} 
                  className="w-10 h-10 rounded-lg object-contain bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                  {school.name}
                </span>
                {school.code && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {school.code}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-semibold text-gray-900 dark:text-gray-100">
                SmartGesti Ensino
              </span>
            </div>
          )}
        </div>

        {/* Centro - Barra de Busca */}
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

        {/* Lado Direito - Seletor + Ações */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* School Selector */}
          <div className="hidden lg:block">
            <SchoolSelector />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

          {/* Notifications */}
          <NotificationBell />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
