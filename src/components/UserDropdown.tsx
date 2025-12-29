import { useAuth } from '@/contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { User, Settings, LogOut, ChevronDown, Hand } from 'lucide-react'
import { logger } from '@/lib/logger'
import { clearAllSessionData } from '@/lib/storage'
import { routes } from '@/lib/routes'
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
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Controlar renderização e animação de entrada/saída
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender) {
      setIsClosing(true)
      const timeoutId = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 350) // Duração da animação de saída
      
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen, shouldRender])

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (
        (buttonRef.current && buttonRef.current.contains(target)) ||
        (dropdownRef.current && dropdownRef.current.contains(target))
      ) {
        return
      }
      
      if (isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleLogoutClick = () => {
    setIsOpen(false)
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      logger.info('Logout initiated', 'UserDropdown', { userId: user?.id })

      // Limpar dados primeiro
      queryClient.clear()
      logger.reset()
      clearAllSessionData()
      await signOut()

      // Aguardar um momento para o usuário ver a mensagem
      setTimeout(() => {
        // Usar navigate ao invés de window.location para evitar flick
        navigate(routes.login(), { replace: true })
      }, 1500)
    } catch (error) {
      logger.error('Error during logout', 'UserDropdown', { error })
      
      try {
        queryClient.clear()
        logger.reset()
        clearAllSessionData()
      } catch (e) {
        console.error('Error clearing storage:', e)
      }
      
      navigate(routes.login(), { replace: true })
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
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

  const dropdownContent = shouldRender && createPortal(
    <div
      ref={dropdownRef}
      className={cn(
        'fixed z-50 min-w-[220px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-xl',
        isClosing ? 'animate-slide-up-smooth' : 'animate-slide-down-smooth'
      )}
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
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
        <button
          onClick={() => {
            setIsOpen(false)
            navigate(routes.profile())
          }}
          className={cn(
            'w-full relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors',
            'text-gray-700 dark:text-gray-300',
            'hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400',
            'focus:bg-blue-50 dark:focus:bg-blue-950/50'
          )}
        >
          <User className="h-4 w-4" />
          <span>Meu Perfil</span>
        </button>
        <button
          onClick={() => {
            setIsOpen(false)
            navigate(routes.settings())
          }}
          className={cn(
            'w-full relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors',
            'text-gray-700 dark:text-gray-300',
            'hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400',
            'focus:bg-blue-50 dark:focus:bg-blue-950/50'
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </button>
      </div>

      <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

      {/* Logout */}
      <div className="py-1">
        <button
          onClick={handleLogoutClick}
          className={cn(
            'w-full relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors',
            'text-red-600 dark:text-red-400',
            'hover:bg-red-50 dark:hover:bg-red-950/50',
            'focus:bg-red-50 dark:focus:bg-red-950/50'
          )}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </div>,
    document.body
  )

  return (
    <>
      <Button 
        ref={buttonRef}
        variant="ghost" 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 h-auto rounded-full',
          'hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          'cursor-pointer',
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
      {dropdownContent}

      {/* Modal de Logout */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent hideCloseButton className="max-w-sm text-center">
          {!isLoggingOut ? (
            <>
              <DialogHeader className="items-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                  <Hand className="h-8 w-8 text-white" />
                </div>
                <DialogTitle className="text-xl">Deseja sair?</DialogTitle>
                <DialogDescription className="text-center">
                  Você tem certeza que deseja encerrar sua sessão?
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={handleLogoutCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </>
          ) : (
            <div className="py-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 animate-pulse">
                <Hand className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Até logo!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                Obrigado por usar o SmartGesti Ensino.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Volte sempre! 👋
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
