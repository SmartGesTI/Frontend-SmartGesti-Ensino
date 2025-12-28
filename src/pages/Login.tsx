import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2, Mail, Lock, Sparkles, Brain, Zap, Shield, UserPlus, Check, X, Globe } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { apiRequest } from '@/services/api'
import { Tenant } from '@/types'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

// Componente do ícone do Google com cores oficiais
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

// Ilustração SVG para o lado esquerdo
const EducationIllustration = () => (
  <svg
    viewBox="0 0 600 600"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Background shapes */}
    <circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.1" />
    <circle cx="500" cy="500" r="100" fill="url(#grad1)" opacity="0.1" />
    
    {/* Book/Education icon */}
    <path
      d="M300 150 L200 200 L300 250 L400 200 Z"
      fill="url(#grad1)"
      opacity="0.8"
    />
    <path
      d="M200 200 L200 400 L300 450 L300 250 Z"
      fill="url(#grad1)"
      opacity="0.6"
    />
    <path
      d="M300 250 L300 450 L400 400 L400 200 Z"
      fill="url(#grad1)"
      opacity="0.4"
    />
    
    {/* Graduation cap */}
    <path
      d="M250 180 L350 180 L350 200 L300 220 L250 200 Z"
      fill="#3B82F6"
    />
    <circle cx="300" cy="200" r="20" fill="#8B5CF6" opacity="0.3" />
    
    {/* Stars/achievements */}
    <path
      d="M150 300 L155 310 L165 310 L157 317 L160 327 L150 322 L140 327 L143 317 L135 310 L145 310 Z"
      fill="#FBBF24"
    />
    <path
      d="M450 350 L453 357 L460 357 L455 362 L458 369 L450 365 L442 369 L445 362 L440 357 L447 357 Z"
      fill="#FBBF24"
    />
  </svg>
)

// Função de validação de senha no padrão Auth0
interface PasswordValidation {
  minLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSymbol: boolean
  isValid: boolean
}

const validatePassword = (password: string): PasswordValidation => {
  const validation: PasswordValidation = {
    minLength: password.length >= 10,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    isValid: false,
  }
  validation.isValid = 
    validation.minLength && 
    validation.hasUpperCase && 
    validation.hasLowerCase && 
    validation.hasNumber && 
    validation.hasSymbol
  return validation
}

// Componente para mostrar requisitos da senha
const PasswordRequirements = ({ password }: { password: string }) => {
  const validation = validatePassword(password)
  
  const requirements = [
    { label: 'Mínimo 10 caracteres', met: validation.minLength },
    { label: 'Pelo menos uma letra maiúscula', met: validation.hasUpperCase },
    { label: 'Pelo menos uma letra minúscula', met: validation.hasLowerCase },
    { label: 'Pelo menos um número', met: validation.hasNumber },
    { label: 'Pelo menos um símbolo (!@#$%^&*...)', met: validation.hasSymbol },
  ]

  if (!password) return null

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-700 mb-2">Requisitos da senha:</p>
      <ul className="space-y-1.5">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            )}
            <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading, user, session } = useAuth()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loadingTenant, setLoadingTenant] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEmailFields, setShowEmailFields] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  const tenantSubdomain = getTenantFromSubdomain()

  useEffect(() => {
    if (tenantSubdomain) {
      apiRequest<Tenant>(`/api/tenants/${tenantSubdomain}`)
        .then((data) => {
          setTenant(data)
        })
        .catch((err) => {
          logger.warn('Tenant not found', 'LoginPage', { subdomain: tenantSubdomain, error: err })
          setTenant({ name: tenantSubdomain } as Tenant)
        })
        .finally(() => setLoadingTenant(false))
    } else {
      setLoadingTenant(false)
    }
  }, [tenantSubdomain])

  useEffect(() => {
    logger.info('Login page loaded', 'LoginPage', {
      isAuthenticated: !!user,
      isLoading: loading,
      tenant: tenant?.name,
      url: window.location.href,
    })

    // Redirecionar se o usuário já estiver autenticado
    if (user && session && !loading) {
      logger.info('User already authenticated, checking email verification', 'LoginPage', {
        email: user.email,
        emailConfirmed: !!user.email_confirmed_at,
      })

      // Se email não está confirmado, redirecionar para verificação OTP
      if (!user.email_confirmed_at) {
        logger.info('Email not confirmed, redirecting to OTP verification', 'LoginPage')
        navigate(`/verificar-otp?email=${encodeURIComponent(user.email || '')}`, { replace: true })
        return
      }

      // Se email está confirmado, redirecionar para selecionar escola
      logger.info('Email confirmed, redirecting to select school', 'LoginPage')
      navigate('/selecionar-escola', { replace: true })
    }
  }, [user, session, loading, tenant, navigate])

  // Função para validar email
  const isValidEmail = (email: string): boolean => {
    if (!email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleGoogleAuth = async () => {
    logger.info('Google login button clicked', 'LoginPage', {
      tenant: tenant?.name,
      tenantSubdomain,
      hasUser: !!user,
      hasSession: !!session,
    })

    if (tenantSubdomain) {
      localStorage.setItem('current_tenant', tenantSubdomain)
      logger.info('Tenant saved for OAuth flow', 'LoginPage', { tenant: tenantSubdomain })
    } else {
      const savedTenant = localStorage.getItem('current_tenant')
      if (savedTenant) {
        logger.info('No subdomain in URL, using saved tenant', 'LoginPage', { savedTenant })
      }
    }

    setAuthError(null)
    try {
      await signInWithGoogle()
    } catch (error: any) {
      logger.error('Error initiating Google OAuth', 'LoginPage', { error })
      const errorMessage = error.message || 'Erro ao iniciar login com Google'
      setAuthError(errorMessage)
      toast.error(errorMessage, {
        duration: 5000,
      })
    }
  }

  const handleEmailPasswordAuth = async (e: React.FormEvent, isSignup: boolean = false) => {
    e.preventDefault()
    
    logger.info(`Email/password ${isSignup ? 'signup' : 'login'} button clicked`, 'LoginPage', {
      tenant: tenant?.name,
      email,
    })

    if (isSignup) {
      if (password !== confirmPassword) {
        setAuthError('As senhas não coincidem')
        setConfirmPasswordError('As senhas não coincidem')
        return
      }
      
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        const missingRequirements = []
        if (!passwordValidation.minLength) missingRequirements.push('mínimo 10 caracteres')
        if (!passwordValidation.hasUpperCase) missingRequirements.push('letra maiúscula')
        if (!passwordValidation.hasLowerCase) missingRequirements.push('letra minúscula')
        if (!passwordValidation.hasNumber) missingRequirements.push('número')
        if (!passwordValidation.hasSymbol) missingRequirements.push('símbolo')
        
        const errorMsg = `A senha deve conter: ${missingRequirements.join(', ')}`
        setPasswordError(errorMsg)
        setAuthError(errorMsg)
        return
      }
    }

    if (tenantSubdomain) {
      localStorage.setItem('current_tenant', tenantSubdomain)
      logger.info('Tenant saved for auth flow', 'LoginPage', { tenant: tenantSubdomain })
    }

    setAuthError(null)
    setIsSubmitting(true)

    try {
      if (isSignup) {
        logger.info('Attempting signup', 'LoginPage', { email })
        const { error } = await signUpWithEmail(email, password)
        
        if (error) {
          let errorMessage = error.message || 'Erro ao criar conta'
          
          if (error.message?.includes('Error sending confirmation email') || 
              error.message?.includes('SMTP') ||
              error.message?.includes('email')) {
            errorMessage = 'Erro ao enviar email de confirmação. ' +
              'Verifique as configurações de email no Supabase Dashboard. ' +
              'Consulte: docs/SUPABASE_EMAIL_DIAGNOSTIC.md'
          }
          
          setAuthError(errorMessage)
          logger.error('Signup failed', 'LoginPage', { email, error: error.message })
          
          // Mensagem de toast específica para erros de email/SMTP
          if (error.message?.includes('SMTP') || error.message?.includes('email')) {
            toast.error('Erro ao criar conta. Verifique as configurações de email no Supabase Dashboard.', {
              duration: 8000,
            })
          } else {
            toast.error(errorMessage, {
              duration: 5000,
            })
          }
        } else {
          logger.info('Signup successful, redirecting to OTP verification', 'LoginPage', { email })
          toast.success('Conta criada! Verifique seu email para o código de confirmação.')
          
          navigate(`/verificar-otp?email=${encodeURIComponent(email)}`, { replace: true })
        }
      } else {
        logger.info('Attempting login', 'LoginPage', { email })
        const { error } = await signInWithEmail(email, password)
        
        if (error) {
          const errorMsg = error.message || 'Erro ao fazer login'
          // Se for erro de credenciais, marcar campos como erro e mostrar apenas toast
          if (errorMsg.includes('Invalid login credentials') || errorMsg.includes('credenciais')) {
            setEmailError('Email ou senha incorretos')
            setPasswordError('Email ou senha incorretos')
            toast.error('Email ou senha incorretos. Verifique suas credenciais.', {
              duration: 5000,
            })
            // Não setar authError para não mostrar o Alert
          } else {
            setAuthError(errorMsg)
            toast.error('Erro ao fazer login. Tente novamente.', {
              duration: 5000,
            })
          }
          logger.error('Login failed', 'LoginPage', { email, error: error.message })
        } else {
          logger.info('Login successful, waiting for session update', 'LoginPage', { email })
          
          // Aguardar um pouco para o Supabase atualizar a sessão
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Verificar sessão atualizada
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          
          if (currentSession?.user) {
            logger.info('Session updated after login', 'LoginPage', {
              email: currentSession.user.email,
              emailConfirmed: !!currentSession.user.email_confirmed_at,
            })
            
            // Se email não está confirmado, redirecionar para verificação OTP
            if (!currentSession.user.email_confirmed_at) {
              logger.info('Email not confirmed, redirecting to OTP verification', 'LoginPage')
              navigate(`/verificar-otp?email=${encodeURIComponent(currentSession.user.email || email)}`, { replace: true })
            } else {
              // Se email está confirmado, redirecionar para selecionar escola
              logger.info('Email confirmed, redirecting to select school', 'LoginPage')
              navigate('/selecionar-escola', { replace: true })
            }
          } else {
            // Se não há sessão, o redirecionamento será feito pelo useEffect quando a sessão for atualizada
            logger.info('No session yet, waiting for AuthContext to update', 'LoginPage')
          }
        }
      }
    } catch (error: any) {
      logger.error('Auth error', 'LoginPage', { email, isSignup, error: error.message })
      const errorMessage = error.message || 'Erro inesperado. Tente novamente.'
      setAuthError(errorMessage)
      toast.error(errorMessage, {
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setAuthError(null)
    setEmailError(null)
    setPasswordError(null)
    setConfirmPasswordError(null)
    setShowEmailFields(false)
  }

  if (loadingTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Lado Esquerdo - Informações do Sistema */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        {/* Imagem de fundo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-[800px] h-[800px]">
            <EducationIllustration />
          </div>
        </div>
        {/* Conteúdo centralizado verticalmente */}
        <div className="relative z-10 max-w-2xl w-full">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SmartGesti Ensino
            </h1>
          </div>
          <p className="text-3xl font-semibold text-gray-800 mb-4 text-center">
            Sistema de Gestão Escolar
          </p>
          <p className="text-2xl text-gray-600 mb-12 text-center">
            AI First - Transformando a educação com inteligência artificial
          </p>
          
          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-lg bg-blue-100 text-blue-600 mt-0.5">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Inteligência Artificial</h3>
                <p className="text-lg text-gray-600">Automação inteligente de processos educacionais</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-lg bg-purple-100 text-purple-600 mt-0.5">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Performance</h3>
                <p className="text-lg text-gray-600">Sistema rápido e eficiente para sua instituição</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-lg bg-green-100 text-green-600 mt-0.5">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Segurança</h3>
                <p className="text-lg text-gray-600">Proteção total dos dados da sua escola</p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-300/50">
            <div className="text-center space-y-3">
              <p className="text-base text-gray-700 font-medium">
                Sistema de Gestão Escolar Inteligente
              </p>
              <a 
                href="https://www.smartgesti.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                <Globe className="h-5 w-5" />
                www.smartgesti.com.br
              </a>
              <p className="text-sm text-gray-500 mt-2">
                © 2024 SmartGesti. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
        <Card className="w-full max-w-lg shadow-2xl border-2 border-gray-200 bg-white">
          <CardHeader className="text-center pb-6 pt-8 px-8 border-b-2 border-gray-200 bg-gray-100/50">
            {tenant?.logo_url && (
              <div className="mb-4 flex justify-center">
                <img src={tenant.logo_url} alt={tenant.name} className="h-14 w-auto" />
              </div>
            )}
            <CardTitle className="text-4xl font-bold text-blue-600 mb-2">
              {tenant ? tenant.name : 'SmartGesti Ensino'}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {tenant ? 'Sistema de gestão educacional' : 'Acesse sua conta ou crie uma nova'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs 
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-gray-100/50 p-1">
                <TabsTrigger 
                  value="login" 
                  className="text-base font-semibold data-[state=active]:bg-blue-400 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 ease-in-out"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-base font-semibold data-[state=active]:bg-blue-400 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 ease-in-out"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* ABA DE LOGIN */}
              <TabsContent value="login" className="space-y-6 mt-6 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-right-2">
                {authError && (
                  <Alert variant="destructive" className="animate-in fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Botão Google */}
                  <Button
                    onClick={handleGoogleAuth}
                    disabled={loading || isSubmitting}
                    variant="google"
                    className="w-full h-12 text-base font-semibold bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all pb-0 mb-0"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        Entrar com Google
                      </>
                    )}
                  </Button>

                  {/* Divisor */}
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-gray-200"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500 font-medium">ou</span>
                    </div>
                  </div>

                  {/* Botão Entrar com Email */}
                  {!showEmailFields ? (
                    <Button
                      onClick={() => setShowEmailFields(true)}
                      variant="outline"
                      className="w-full h-12 text-base font-semibold border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-primary hover:text-primary"
                      size="lg"
                      disabled={isSubmitting || loading}
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Entrar com Email
                    </Button>
                  ) : (
                    <form onSubmit={(e) => handleEmailPasswordAuth(e, false)} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-sm font-medium mb-1.5 block" required>Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setEmailError(null)
                            setAuthError(null)
                          }}
                          onBlur={(e) => {
                            if (e.target.value && !e.target.validity.valid) {
                              setEmailError('Email inválido')
                            }
                          }}
                          disabled={isSubmitting || loading}
                          required
                          autoComplete="email"
                          className="h-11"
                          error={!!emailError}
                          errorMessage={emailError || undefined}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-sm font-medium mb-1.5 block" required>Senha</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordError(null)
                            setAuthError(null)
                          }}
                          onBlur={(e) => {
                            if (!e.target.value) {
                              setPasswordError('A senha é obrigatória')
                            }
                          }}
                          disabled={isSubmitting || loading}
                          required
                          minLength={6}
                          autoComplete="current-password"
                          className="h-11"
                          error={!!passwordError}
                          errorMessage={passwordError || undefined}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowEmailFields(false)
                            setEmail('')
                            setPassword('')
                            setAuthError(null)
                          }}
                          className="flex-1 border-gray-300 hover:bg-gray-100 text-gray-700"
                          disabled={isSubmitting || loading}
                          size="sm"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || loading || !email || !password || !isValidEmail(email)}
                          className="flex-1 font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                          size="sm"
                        >
                          {isSubmitting || loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Entrando...
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Entrar
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </TabsContent>

              {/* ABA DE REGISTRO */}
              <TabsContent value="register" className="space-y-6 mt-6 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-left-2">
                {authError && (
                  <Alert variant="destructive" className="animate-in fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Botão Google */}
                  <Button
                    onClick={handleGoogleAuth}
                    disabled={loading || isSubmitting}
                    variant="google"
                    className="w-full h-12 text-base font-semibold bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all pb-0 mb-0"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        Registrar com Google
                      </>
                    )}
                  </Button>

                  {/* Divisor */}
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-gray-200"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500 font-medium">ou</span>
                    </div>
                  </div>

                  {/* Formulário de Registro */}
                  <form onSubmit={(e) => handleEmailPasswordAuth(e, true)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium mb-1.5 block" required>Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setEmailError(null)
                          setAuthError(null)
                        }}
                        onBlur={(e) => {
                          if (e.target.value && !e.target.validity.valid) {
                            setEmailError('Email inválido')
                          }
                        }}
                        disabled={isSubmitting || loading}
                        required
                        autoComplete="email"
                        className="h-11"
                        error={!!emailError}
                        errorMessage={emailError || undefined}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium mb-1.5 block" required>Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setPasswordError(null)
                          setAuthError(null)
                          if (confirmPassword && e.target.value !== confirmPassword) {
                            setConfirmPasswordError('As senhas não coincidem')
                          } else {
                            setConfirmPasswordError(null)
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value) {
                            const validation = validatePassword(e.target.value)
                            if (!validation.isValid) {
                              const missingRequirements = []
                              if (!validation.minLength) missingRequirements.push('mínimo 10 caracteres')
                              if (!validation.hasUpperCase) missingRequirements.push('letra maiúscula')
                              if (!validation.hasLowerCase) missingRequirements.push('letra minúscula')
                              if (!validation.hasNumber) missingRequirements.push('número')
                              if (!validation.hasSymbol) missingRequirements.push('símbolo')
                              
                              setPasswordError(`A senha deve conter: ${missingRequirements.join(', ')}`)
                            }
                          }
                        }}
                        disabled={isSubmitting || loading}
                        required
                        minLength={10}
                        autoComplete="new-password"
                        className="h-11"
                        error={!!passwordError}
                        errorMessage={passwordError || undefined}
                      />
                      <PasswordRequirements password={password} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password" className="text-sm font-medium mb-1.5 block" required>Confirmar Senha</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Digite a senha novamente"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setConfirmPasswordError(null)
                          setAuthError(null)
                          if (e.target.value && password && e.target.value !== password) {
                            setConfirmPasswordError('As senhas não coincidem')
                          } else {
                            setConfirmPasswordError(null)
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value && password && e.target.value !== password) {
                            setConfirmPasswordError('As senhas não coincidem')
                          }
                        }}
                        disabled={isSubmitting || loading}
                        required
                        minLength={10}
                        autoComplete="new-password"
                        className="h-11"
                        error={!!confirmPasswordError}
                        errorMessage={confirmPasswordError || undefined}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || 
                        loading || 
                        !email || 
                        !password || 
                        !confirmPassword || 
                        password !== confirmPassword ||
                        !validatePassword(password).isValid ||
                        !!emailError ||
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                      }
                      className="w-full font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                      size="sm"
                    >
                      {isSubmitting || loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Registrar com Email
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
