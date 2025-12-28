import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Mail, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { logger } from '@/lib/logger'
import { toast } from 'sonner'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { SystemInfoSidebar } from '@/components/SystemInfoSidebar'
import { apiRequest } from '@/services/api'
import { Tenant } from '@/types'

export default function OtpVerification() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { verifyOtp, resendOtp } = useAuth()
  const tenantSubdomain = getTenantFromSubdomain()
  
  const email = searchParams.get('email') || ''
  // Supabase pode gerar tokens de 6 ou 8 dígitos, vamos suportar até 8
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '', '', ''])
  const [otpLength, setOtpLength] = useState(8) // Começar com 8, ajustar se necessário
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loadingTenant, setLoadingTenant] = useState(true)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Carregar tenant
  useEffect(() => {
    if (tenantSubdomain) {
      apiRequest<Tenant>(`/api/tenants/${tenantSubdomain}`)
        .then((data) => {
          setTenant(data)
        })
        .catch((err) => {
          logger.warn('Tenant not found', 'OtpVerification', { subdomain: tenantSubdomain, error: err })
          setTenant({ name: tenantSubdomain } as Tenant)
        })
        .finally(() => setLoadingTenant(false))
    } else {
      setLoadingTenant(false)
    }
  }, [tenantSubdomain])

  // Timer para reenvio
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Verificar se email foi fornecido
  useEffect(() => {
    if (!email) {
      logger.warn('No email provided for OTP verification', 'OtpVerification')
      navigate('/login', { replace: true })
      return
    }

    logger.info('OTP verification page loaded', 'OtpVerification', { email })
    
    // Verificar se há uma sessão pendente (usuário criado mas email não confirmado)
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          logger.warn('Error checking session', 'OtpVerification', { error: error.message })
        } else if (session && !session.user.email_confirmed_at) {
          logger.info('User session found but email not confirmed, OTP should have been sent', 'OtpVerification', {
            email: session.user.email,
            userId: session.user.id,
          })
        } else if (!session) {
          logger.warn('No session found, user may need to register again', 'OtpVerification', { email })
        }
      } catch (error: any) {
        logger.warn('Error checking session', 'OtpVerification', { error: error.message })
      }
    }

    checkSession()
  }, [email, navigate])

  const handleOtpChange = (index: number, value: string) => {
    // Aceitar apenas números
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    // Auto-focus no próximo input
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Verificar se todos os dígitos foram preenchidos (6 ou 8 dígitos)
    const filledDigits = newOtp.filter(d => d !== '').length
    if (filledDigits === 6 || filledDigits === 8) {
      // Verificar se os dígitos preenchidos são consecutivos (sem gaps)
      const otpCode = newOtp.slice(0, filledDigits).join('')
      if (otpCode.length === filledDigits) {
        // Atualizar o tamanho esperado
        setOtpLength(filledDigits)
        // Verificar automaticamente quando atingir 6 ou 8 dígitos
        handleVerify(otpCode)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Aceitar apenas números e limitar a 8 dígitos (Supabase pode gerar 6 ou 8)
    const digits = pastedData.replace(/\D/g, '').slice(0, 8)
    
    if (digits.length >= 6 && digits.length <= 8) {
      // Preencher array com os dígitos colados
      const newOtp = [...otp]
      digits.split('').forEach((digit, index) => {
        if (index < 8) {
          newOtp[index] = digit
        }
      })
      setOtp(newOtp)
      setError(null)
      // Atualizar o tamanho esperado baseado no que foi colado
      setOtpLength(digits.length)
      // Focar no último input preenchido
      const lastIndex = Math.min(digits.length - 1, 7)
      inputRefs.current[lastIndex]?.focus()
      // Verificar automaticamente
      handleVerify(digits)
    } else {
      toast.error('Código deve ter entre 6 e 8 dígitos')
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: limpar campo atual e voltar para o anterior
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Arrow keys: navegar entre inputs
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('')
    
    // Aceitar códigos de 6 a 8 dígitos (Supabase pode gerar diferentes tamanhos)
    if (otpCode.length < 6 || otpCode.length > 8) {
      setError('Por favor, insira o código completo (6 a 8 dígitos)')
      return
    }

    if (attempts >= 3) {
      setError('Muitas tentativas. Aguarde 5 minutos antes de tentar novamente.')
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      logger.info('Verifying OTP', 'OtpVerification', { email })
      
      const { error } = await verifyOtp(email, otpCode)
      
      if (error) {
        setAttempts(attempts + 1)
        
        const errorMsg = error.message.toLowerCase()
        
        // Verificar se o token expirou
        if (errorMsg.includes('expired') || 
            errorMsg.includes('expirado') || 
            errorMsg.includes('expirou') ||
            errorMsg.includes('token has expired') ||
            errorMsg.includes('código expirado') ||
            errorMsg.includes('otp expired')) {
          const errorMessage = 'Código expirado. Solicite um novo código.'
          setError(errorMessage)
          toast.error(errorMessage, {
            duration: 5000,
          })
          // Limpar os inputs quando o código expirar
          setOtp(['', '', '', '', '', '', '', ''])
          setOtpLength(8)
          inputRefs.current[0]?.focus()
        } else if (errorMsg.includes('invalid') || 
                   errorMsg.includes('inválido') ||
                   errorMsg.includes('incorrect') ||
                   errorMsg.includes('incorreto') ||
                   errorMsg.includes('wrong') ||
                   errorMsg.includes('errado')) {
          const errorMessage = 'Código inválido. Verifique e tente novamente.'
          setError(errorMessage)
          toast.error(errorMessage, {
            duration: 4000,
          })
        } else {
          const errorMessage = error.message || 'Erro ao verificar código. Tente novamente.'
          setError(errorMessage)
          toast.error(errorMessage, {
            duration: 5000,
          })
        }
        
        logger.error('OTP verification failed', error.message, 'OtpVerification', {
          email,
          attempts: attempts + 1,
          errorType: errorMsg.includes('expired') ? 'expired' : errorMsg.includes('invalid') ? 'invalid' : 'other',
        })
      } else {
        logger.info('OTP verified successfully', 'OtpVerification', { email })
        toast.success('Email verificado com sucesso!')
        
        // Aguardar um pouco para o Supabase processar a sessão e atualizar o JWT
        // Após verificar OTP, o Supabase atualiza email_confirmed_at, mas o JWT pode precisar ser atualizado
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // IMPORTANTE: Sincronizar usuário com o banco ANTES de redirecionar
        // O usuário existe no Supabase Auth mas precisa ser criado na tabela users
        try {
          logger.info('Syncing user to database after OTP verification', 'OtpVerification', { email })
          
          // Obter sessão e usuário atualizados do Supabase
          // Isso garante que temos os dados mais recentes após verificar o OTP
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          if (sessionError || !session?.access_token) {
            throw new Error('No session after OTP verification')
          }
          
          // Buscar dados atualizados do usuário diretamente do Supabase
          // Isso garante que temos email_confirmed_at atualizado
          const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser()
          if (userError || !supabaseUser) {
            throw new Error('Failed to get user data from Supabase')
          }
          
          logger.info('Got updated user data from Supabase', 'OtpVerification', {
            userId: supabaseUser.id,
            email: supabaseUser.email,
            emailConfirmed: !!supabaseUser.email_confirmed_at,
          })
          
          const tenantSubdomain = getTenantFromSubdomain()
          
          // Chamar endpoint de sincronização
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
              ...(tenantSubdomain && { 'x-tenant-id': tenantSubdomain }),
            },
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `Sync failed with status ${response.status}`)
          }
          
          const syncData = await response.json()
          
          logger.info('User synced successfully after OTP verification', 'OtpVerification', {
            userId: syncData.user?.id,
            userEmail: syncData.user?.email,
            tenantId: syncData.user?.tenant_id,
          })
          
          // Redirecionar para selecionar escola (que vai para aguardando aprovação se não tiver tenant_id)
          navigate('/selecionar-escola', { replace: true })
        } catch (syncError: any) {
          logger.error('Failed to sync user after OTP verification', syncError.message, 'OtpVerification', {
            error: syncError.message,
            email,
          })
          
          // Mesmo com erro de sync, redirecionar
          // O SelectSchool tentará sincronizar novamente via /api/users/me
          // E o /api/users/me também tenta sincronizar se não encontrar o usuário
          toast.warning('Usuário verificado, mas houve um problema ao sincronizar. Redirecionando...')
          navigate('/selecionar-escola', { replace: true })
        }
      }
    } catch (error: any) {
      logger.error('OTP verification exception', error.message, 'OtpVerification', {
        stack: error.stack,
      })
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) {
      toast.info(`Aguarde ${resendTimer} segundos antes de solicitar um novo código`)
      return
    }

    setIsResending(true)
    setError(null)
    setOtp(['', '', '', '', '', '', '', ''])
    setOtpLength(8) // Resetar para 8 dígitos
    setAttempts(0)

    try {
      logger.info('Resending OTP', 'OtpVerification', { email })
      
      const { error } = await resendOtp(email)
      
      if (error) {
        if (error.message.includes('rate limit') || error.message.includes('limite')) {
          toast.error('Aguarde 60 segundos antes de solicitar um novo código')
          setResendTimer(60)
          setCanResend(false)
        } else {
          toast.error('Erro ao reenviar código: ' + (error.message || 'Erro desconhecido'))
        }
      } else {
        toast.success('Código reenviado! Verifique sua caixa de entrada.')
        setResendTimer(60)
        setCanResend(false)
        inputRefs.current[0]?.focus()
      }
    } catch (error: any) {
      logger.error('Resend OTP exception', error.message, 'OtpVerification')
      toast.error('Erro ao reenviar código')
    } finally {
      setIsResending(false)
    }
  }

  if (loadingTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Lado Esquerdo - Informações do Sistema */}
      <SystemInfoSidebar variant="security" />

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-gray-200 bg-white">
          <CardHeader className="text-center bg-gray-100/50 pb-6 pt-8 px-8 border-b-2 border-gray-200">
            {tenant?.logo_url && (
              <div className="mb-4 flex justify-center">
                <img src={tenant.logo_url} alt={tenant.name} className="h-14 w-auto" />
              </div>
            )}
            <CardTitle className="text-4xl font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
              <Mail className="h-8 w-8 text-blue-600" />
              Verifique seu Email
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Digite o código enviado para
              <br />
              <strong className="text-gray-800 font-semibold">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in border-red-500">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <AlertDescription className="text-red-600 text-center">{error}</AlertDescription>
              </div>
            </Alert>
          )}

          {attempts >= 3 && (
            <Alert className="animate-in fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Muitas tentativas incorretas. Aguarde 5 minutos ou solicite um novo código.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="flex justify-center gap-2.5">
              {otp.slice(0, otpLength).map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { if (el) inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isVerifying || attempts >= 3}
                  className="w-12 h-14 text-center text-xl font-bold focus-visible:ring-2 focus-visible:ring-primary"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="text-sm text-center text-gray-600">
              Digite o código de {otpLength} dígitos recebido por email
            </p>

            <Button
              onClick={() => handleVerify()}
              disabled={isVerifying || otp.slice(0, otpLength).some(d => d === '') || attempts >= 3}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
              size="sm"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verificar Código
                </>
              )}
            </Button>

            <div className="text-center space-y-3">
              <Button
                onClick={handleResend}
                disabled={isResending || !canResend || attempts >= 3}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-100 text-gray-700"
                size="sm"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : canResend ? (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar Código
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar Código ({resendTimer}s)
                  </>
                )}
              </Button>

              <div className="text-sm text-center text-gray-600 space-y-2 pt-2">
                <p className="font-semibold text-gray-800">
                  Não recebeu o código?
                </p>
                <div className="space-y-1 text-left max-w-sm mx-auto">
                  <p>1. Verifique a pasta de spam/lixo eletrônico</p>
                  <p>2. Aguarde alguns minutos (emails podem ter delay)</p>
                  <p>3. Clique em "Reenviar Código" após 60 segundos</p>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Precisa de Ajuda? Contate o{' '}
                  <a 
                    href="mailto:administracao@smartgesti.com.br" 
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    suporte
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
