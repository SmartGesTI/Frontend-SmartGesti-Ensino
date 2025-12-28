import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { routes } from '@/lib/routes'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  resendConfirmationEmail: (email: string) => Promise<{ error: AuthError | null }>
  verifyOtp: (email: string, token: string) => Promise<{ error: AuthError | null }>
  resendOtp: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session) {
        logger.info('User authenticated', 'AuthContext', {
          userId: session.user.id,
          email: session.user.email,
        })
      } else {
        logger.info('User signed out', 'AuthContext')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      logger.error('Sign in error', 'AuthContext', { email, error: error.message })
    }
    
    return { error }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    logger.info('Attempting signup', 'AuthContext', { email })
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: routes.getAuthCallbackUrl(),
        // Não usar emailRedirectTo para OTP, apenas para magic links
        // O OTP será enviado automaticamente se email confirmations estiver habilitado
      },
    })
    
    if (error) {
      // Erro 500 geralmente significa que o Supabase tentou enviar o email mas falhou
      // Isso pode acontecer se:
      // 1. "Confirm email" está habilitado mas SMTP não está configurado
      // 2. Template de email tem problema
      // 3. Rate limit ou outras configurações
      
      let errorMessage = error.message
      
      if (error.message.includes('Error sending confirmation email') || 
          error.message.includes('500') ||
          (error as any).status === 500) {
        errorMessage = 'Erro ao enviar email de confirmação. ' +
          'Se você está usando Gmail SMTP, certifique-se de usar uma "App Password" (não a senha normal). ' +
          'Consulte: docs/SUPABASE_GMAIL_SMTP_TROUBLESHOOTING.md'
        
        logger.error('Sign up error - Email sending failed', 'AuthContext', { 
          email, 
          error: error.message,
          status: (error as any).status,
          hint: 'Gmail requires App Password for SMTP. Check: https://myaccount.google.com/apppasswords'
        })
      } else {
        logger.error('Sign up error', 'AuthContext', { email, error: error.message })
      }
      
      // Retornar o erro original, mas com mensagem melhorada
      return { error: { ...error, message: errorMessage } as AuthError }
    } else {
      logger.info('User signed up successfully', 'AuthContext', { 
        email,
        userId: data.user?.id,
        emailSent: !!data.user,
        emailConfirmed: data.user?.email_confirmed_at,
        // Se email confirmations estiver habilitado, o OTP será enviado automaticamente
      })
      
      // Verificar se o email foi enviado
      // O Supabase envia o OTP automaticamente se enable_confirmations = true
      // Se não foi enviado, pode ser que:
      // 1. enable_confirmations está desabilitado no Dashboard
      // 2. SMTP não está configurado
      // 3. Rate limit atingido
    }
    
    return { error: null }
  }

  const signInWithGoogle = async () => {
    // Usar URL completa do callback OAuth
    const redirectUrl = routes.getAuthCallbackUrl()
    
    logger.info('Initiating Google OAuth', 'AuthContext', {
      redirectUrl,
      fullOrigin: window.location.origin,
    })
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        // Forçar novo login mesmo se já houver sessão
        skipBrowserRedirect: false,
      },
    })
    
    if (error) {
      logger.error('Google sign in error', 'AuthContext', { error: error.message })
      throw error
    }
    
    // O Supabase vai redirecionar automaticamente para o Google
    // Não precisamos fazer nada aqui
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      logger.error('Sign out error', 'AuthContext', { error: error.message })
    } else {
      logger.info('User signed out successfully', 'AuthContext')
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: routes.getResetPasswordUrl(),
    })
    
    if (error) {
      logger.error('Reset password error', 'AuthContext', { email, error: error.message })
    } else {
      logger.info('Password reset email sent', 'AuthContext', { email })
    }
    
    return { error }
  }

  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: routes.getAuthCallbackUrl(),
      },
    })
    
    if (error) {
      logger.error('Resend confirmation email error', 'AuthContext', { email, error: error.message })
    } else {
      logger.info('Confirmation email resent', 'AuthContext', { email })
    }
    
    return { error }
  }

  const verifyOtp = async (email: string, token: string) => {
    logger.info('Verifying OTP', 'AuthContext', { email })
    
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    
    if (error) {
      logger.error('OTP verification error', 'AuthContext', { email, error: error.message })
    } else {
      logger.info('OTP verified successfully', 'AuthContext', { email })
    }
    
    return { error }
  }

  const resendOtp = async (email: string) => {
    logger.info('Resending OTP', 'AuthContext', { email })
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    
    if (error) {
      logger.error('Resend OTP error', 'AuthContext', { email, error: error.message })
    } else {
      logger.info('OTP resent successfully', 'AuthContext', { email })
    }
    
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        resendConfirmationEmail,
        verifyOtp,
        resendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
