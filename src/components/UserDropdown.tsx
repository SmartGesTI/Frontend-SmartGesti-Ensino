import { useAuth } from '@/contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { logger } from '@/lib/logger'
import { clearAllSessionData } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface UserDropdownProps {
  className?: string
}

export function UserDropdown({ className }: UserDropdownProps) {
  const { user, signOut } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      logger.info('Logout initiated', 'UserDropdown', { userId: user?.id })

      queryClient.clear()
      logger.reset()
      clearAllSessionData()
      await signOut()

      setTimeout(() => {
        window.location.replace('/login')
      }, 100)
    } catch (error) {
      logger.error('Error during logout', 'UserDropdown', { error })
      
      try {
        queryClient.clear()
        logger.reset()
        clearAllSessionData()
      } catch (e) {
        console.error('Error clearing storage:', e)
      }
      
      window.location.replace('/login')
    }
  }

  const getUserInitials = () => {
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email
    if (!fullName) return '?'
    const names = fullName.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
    }
    return names[0].charAt(0).toUpperCase()
  }

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'
  const userRole = 'Administrador' // TODO: pegar do contexto de permissões
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 h-auto rounded-full',
            'hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
            className
          )}
        >
          <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 group-hover:border-blue-400">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className={cn(
            'h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="z-50 min-w-[220px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
      >
        {/* Header com nome e cargo */}
        <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800 mb-1">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[140px]">
                {userName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false)
              navigate('/perfil')
            }}
            className={cn(
              'relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400',
              'focus:bg-blue-50 dark:focus:bg-blue-950/50'
            )}
          >
            <User className="h-4 w-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false)
              navigate('/configuracoes')
            }}
            className={cn(
              'relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400',
              'focus:bg-blue-50 dark:focus:bg-blue-950/50'
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

        {/* Logout */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              'relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors',
              'text-red-600 dark:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-950/50',
              'focus:bg-red-50 dark:focus:bg-red-950/50',
              isLoggingOut && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoggingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                <span>Saindo...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </>
            )}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
