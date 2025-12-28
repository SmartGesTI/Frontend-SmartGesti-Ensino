import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Mail, LogOut, RefreshCw } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

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
    
    // Limpar tudo
    queryClient.clear()
    localStorage.clear()
    sessionStorage.clear()
    
    // Limpar cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4">
              <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verifique seu Email</CardTitle>
          <CardDescription>
            Precisamos confirmar seu endereço de email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Email de Verificação Enviado</AlertTitle>
            <AlertDescription>
              Enviamos um link de verificação para <strong>{user?.email}</strong>.
              <br />
              <br />
              Verifique sua caixa de entrada e também a pasta de spam.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={handleCheckAgain}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Já Verifiquei - Continuar
            </Button>

            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
              variant="outline"
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
              className="w-full"
              variant="ghost"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground space-y-2">
            <p>
              <strong>Não recebeu o email?</strong>
            </p>
            <p>
              1. Verifique a pasta de spam<br />
              2. Aguarde alguns minutos<br />
              3. Clique em "Reenviar Email"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
