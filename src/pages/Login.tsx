import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { apiRequest } from '@/services/api'
import { Tenant } from '@/types'
import { toast } from 'sonner'

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, loading, user, session } = useAuth()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loadingTenant, setLoadingTenant] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const tenantSubdomain = getTenantFromSubdomain()

  useEffect(() => {
    // Buscar informações do tenant pelo subdomínio
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

    // Não redirecionar automaticamente se estiver na página de login
    // Deixar o usuário escolher como quer fazer login
    // O redirecionamento só acontece após autenticação bem-sucedida
    // (via AuthCallback ou após login bem-sucedido)
  }, [user, loading, navigate, tenant])

  const handleGoogleAuth = async () => {
    logger.info('Google login button clicked', 'LoginPage', {
      tenant: tenant?.name,
      tenantSubdomain,
      hasUser: !!user,
      hasSession: !!session,
      currentHost: window.location.host,
      currentOrigin: window.location.origin,
    })

    // SEMPRE salvar o tenant antes de iniciar OAuth
    // Isso é crítico para restaurar o subdomínio após o callback
    if (tenantSubdomain) {
      localStorage.setItem('current_tenant', tenantSubdomain)
      logger.info('Tenant saved for OAuth flow', 'LoginPage', { tenant: tenantSubdomain })
    } else {
      // Se não há subdomínio na URL, tentar usar o tenant salvo
      const savedTenant = localStorage.getItem('current_tenant')
      if (savedTenant) {
        logger.info('No subdomain in URL, using saved tenant', 'LoginPage', { savedTenant })
      }
    }

    setAuthError(null)
    try {
      // O signInWithGoogle vai redirecionar para o Google OAuth
      // Não precisa fazer nada após isso, o redirecionamento acontece automaticamente
      await signInWithGoogle()
    } catch (error: any) {
      logger.error('Error initiating Google OAuth', 'LoginPage', { error })
      setAuthError(error.message || 'Erro ao iniciar login com Google')
    }
  }

  const handleEmailPasswordAuth = async (e: React.FormEvent, isSignup: boolean = false) => {
    e.preventDefault()
    
    logger.info(`Email/password ${isSignup ? 'signup' : 'login'} button clicked`, 'LoginPage', {
      tenant: tenant?.name,
      email,
    })

    if (tenantSubdomain) {
      localStorage.setItem('current_tenant', tenantSubdomain)
      logger.info('Tenant saved for auth flow', 'LoginPage', { tenant: tenantSubdomain })
    }

    setAuthError(null)
    setIsSubmitting(true)

    try {
      if (isSignup) {
        // Registro: criar conta e redirecionar para verificação OTP
        logger.info('Attempting signup', 'LoginPage', { email })
        const { error } = await signUpWithEmail(email, password)
        
        if (error) {
          // Mensagem de erro mais específica para problemas de email
          let errorMessage = error.message || 'Erro ao criar conta'
          
          if (error.message?.includes('Error sending confirmation email') || 
              error.message?.includes('SMTP') ||
              error.message?.includes('email')) {
            errorMessage = 'Erro ao enviar email de confirmação. ' +
              'Verifique as configurações de email no Supabase Dashboard. ' +
              'Consulte: docs/SUPABASE_EMAIL_DIAGNOSTIC.md'
          }
          
          setAuthError(errorMessage)
          logger.error('Signup failed', error.message, 'LoginPage', { email, error })
          
          // Mostrar toast com instruções
          toast.error('Erro ao criar conta. Verifique as configurações de email no Supabase Dashboard.', {
            duration: 8000,
          })
        } else {
          logger.info('Signup successful, redirecting to OTP verification', 'LoginPage', { email })
          toast.success('Conta criada! Verifique seu email para o código de confirmação.')
          
          // Redirecionar para página de verificação OTP
          navigate(`/verificar-otp?email=${encodeURIComponent(email)}`, { replace: true })
        }
      } else {
        // Login: fazer login normalmente
        logger.info('Attempting login', 'LoginPage', { email })
        const { error } = await signInWithEmail(email, password)
        
        if (error) {
          setAuthError(error.message || 'Erro ao fazer login')
          logger.error('Login failed', error.message, 'LoginPage', { email })
        } else {
          logger.info('Login successful', 'LoginPage', { email })
          // O redirecionamento será feito automaticamente pelo AuthCallback ou pelo sistema de rotas
        }
      }
    } catch (error: any) {
      logger.error('Auth error', error.message, 'LoginPage', { email, isSignup })
      setAuthError(error.message || 'Erro inesperado. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          {tenant?.logo_url && (
            <div className="flex justify-center mb-4">
              <img src={tenant.logo_url} alt={tenant.name} className="h-16 w-auto" />
            </div>
          )}
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {tenant ? `Bem-vindo à ${tenant.name}` : 'SmartGesti Ensino'}
          </CardTitle>
          <CardDescription className="text-lg">
            {tenant ? 'Sistema de gestão educacional' : 'Acesse sua instituição'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="login" 
            className="w-full"
            onValueChange={() => {
              setEmail('')
              setPassword('')
              setAuthError(null)
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            {/* ABA DE LOGIN */}
            <TabsContent value="login" className="space-y-4">
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {authError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Entrar com Google
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou</span>
                  </div>
                </div>

                <form onSubmit={(e) => handleEmailPasswordAuth(e, false)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting || loading}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting || loading}
                      required
                      minLength={6}
                      autoComplete="current-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full h-12"
                    size="lg"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar com Email'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* ABA DE CRIAR CONTA */}
            <TabsContent value="register" className="space-y-4">
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {authError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  variant="outline"
                  className="w-full h-12"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Registrar com Google
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou</span>
                  </div>
                </div>

                <form onSubmit={(e) => handleEmailPasswordAuth(e, true)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting || loading}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting || loading}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-muted-foreground">
                      A senha deve ter pelo menos 6 caracteres
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full h-12"
                    size="lg"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Registrar com Email'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
