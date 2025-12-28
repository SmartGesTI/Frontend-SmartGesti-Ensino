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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Verifique seu Email</CardTitle>
          <CardDescription className="text-base">
            Precisamos confirmar seu endereço de email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="animate-in fade-in">
            <Mail className="h-4 w-4" />
            <AlertTitle className="font-semibold">Email de Verificação Enviado</AlertTitle>
            <AlertDescription className="mt-2">
              Enviamos um link de verificação para <strong className="text-foreground">{user?.email}</strong>.
              <br />
              <br />
              Verifique sua caixa de entrada e também a pasta de spam.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={handleCheckAgain}
              className="w-full h-11"
              variant="default"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Já Verifiquei - Continuar
            </Button>

            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full h-11"
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
              className="w-full h-11"
              variant="ghost"
              size="lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>

          <div className="text-sm text-center text-muted-foreground space-y-2 pt-2">
            <p className="font-semibold text-foreground">
              Não recebeu o email?
            </p>
            <div className="space-y-1 text-left max-w-sm mx-auto">
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
