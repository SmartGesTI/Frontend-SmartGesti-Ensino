import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme, Theme } from '@/contexts/ThemeContext'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ThemeToggle({ className, variant = 'outline', size = 'icon' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Claro', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Escuro', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'Sistema', icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn('relative', className)}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="z-50 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 shadow-lg"
      >
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors',
              'text-gray-700 dark:text-gray-300',
              'hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400',
              theme === t.value && 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white'
            )}
          >
            {t.icon}
            <span>{t.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Versão simples sem dropdown - apenas alterna entre claro e escuro
export function ThemeToggleSimple({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={className}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
