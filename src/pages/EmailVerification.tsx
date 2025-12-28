import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Mail, LogOut, RefreshCw } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { clearAllSessionData } from '@/lib/storage'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function EmailVerification() {
  const { user, signOut, resendConfirmationEmail } = useAuth()
  const queryClient = useQueryClient()
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = async () => {
    if (!user?.email) {
      toast.error('Email não disponível')
      return
    }

    setIsResending(true)
    
    try {
      logger.info('Resending verification email', 'EmailVerification', {
        email: user.email,
      })

      const { error } = await resendConfirmationEmail(user.email)
      
      if (error) {
        throw error
      }

      toast.success('Email de verificação reenviado! Verifique sua caixa de entrada.')
    } catch (error: any) {
      logger.error('Failed to resend email', error.message, 'EmailVerification')
      toast.error('Erro ao reenviar email: ' + (error.message || 'Erro desconhecido'))
    } finally {
      setIsResending(false)
    }
  }

  const handleLogout = async () => {
    logger.info('User logging out from email verification', 'EmailVerification')
    
    // Limpar tudo preservando preferências do usuário
    queryClient.clear()
    clearAllSessionData()
    
    await signOut()
    window.location.replace('/login')
  }

  const handleCheckAgain = () => {
    logger.info('User checking email verification status', 'EmailVerification')
    toast.info('Faça logout e login novamente para verificar')
    
    setTimeout(() => {
      handleLogout()
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* Botão de Tema */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 border-border bg-card">
        <CardHeader className="text-center space-y-4 pb-6 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/40 p-4">
              <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">Verifique seu Email</CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-300">
            Precisamos confirmar seu endereço de email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <Alert className="animate-in fade-in bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">Email de Verificação Enviado</AlertTitle>
            <AlertDescription className="mt-2 text-gray-700 dark:text-gray-300">
              Enviamos um link de verificação para <strong className="text-gray-900 dark:text-gray-100">{user?.email}</strong>.
              <br />
              <br />
              Verifique sua caixa de entrada e também a pasta de spam.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={handleCheckAgain}
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Já Verifiquei - Continuar
            </Button>

            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full h-11 border-2 hover:scale-[1.02] transition-all"
              variant="outline"
              size="lg"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Reenviar Email
                </>
              )}
            </Button>

            <Button 
              onClick={handleLogout}
              className="w-full h-11 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
              variant="ghost"
              size="lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>

          <div className="text-sm text-center space-y-2 pt-2">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              Não recebeu o email?
            </p>
            <div className="space-y-1 text-left max-w-sm mx-auto text-gray-600 dark:text-gray-400">
              <p>1. Verifique a pasta de spam</p>
              <p>2. Aguarde alguns minutos</p>
              <p>3. Clique em "Reenviar Email"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
