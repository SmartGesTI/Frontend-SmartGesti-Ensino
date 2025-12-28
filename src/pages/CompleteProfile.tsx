import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertCircle, Loader2, User as UserIcon } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { supabase } from '@/lib/supabase'

interface CompleteProfileFormData {
  given_name: string
  family_name: string
  avatar_url: string
}

export default function CompleteProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { token, isReady } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  const [formData, setFormData] = useState<CompleteProfileFormData>({
    given_name: '',
    family_name: '',
    avatar_url: (user?.user_metadata?.avatar_url || user?.user_metadata?.picture) || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.given_name.trim() || formData.given_name.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres')
      return
    }

    if (!formData.family_name.trim() || formData.family_name.trim().length < 2) {
      setError('Sobrenome deve ter pelo menos 2 caracteres')
      return
    }

    if (!isReady || !token) {
      toast.error('Token de autenticação não disponível')
      return
    }

    setIsSubmitting(true)

    try {
      logger.info('Completing user profile', 'CompleteProfile', {
        email: user?.email,
        given_name: formData.given_name,
        family_name: formData.family_name,
      })

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...(tenantSubdomain && { 'x-tenant-id': tenantSubdomain }),
        },
        body: JSON.stringify({
          given_name: formData.given_name.trim(),
          family_name: formData.family_name.trim(),
          avatar_url: formData.avatar_url.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao completar perfil')
      }

      logger.info('Profile completed successfully', 'CompleteProfile', {
        userId: data.user?.id,
        fullName: data.user?.full_name,
        tenantId: data.user?.tenant_id,
      })

      toast.success('Perfil completado com sucesso!')

      // Recarregar sessão do Supabase para atualizar user_metadata no frontend
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // Forçar atualização da sessão para pegar novos metadados
          await supabase.auth.refreshSession()
          logger.info('Session refreshed after profile completion', 'CompleteProfile')
        }
      } catch (refreshError) {
        logger.warn('Failed to refresh session', 'CompleteProfile', { error: refreshError })
        // Não bloquear o redirecionamento se falhar
      }

      // Verificar se tem tenant_id para decidir o redirecionamento
      // Se não tiver tenant_id, vai para aguardando aprovação
      // Se tiver tenant_id, vai para selecionar escola
      if (!data.user?.tenant_id) {
        // Sem tenant_id = aguardando aprovação
        logger.info('User has no tenant_id, redirecting to pending approval', 'CompleteProfile', {
          userId: data.user?.id,
        })
        setTimeout(() => {
          navigate('/aguardando-aprovacao', { replace: true })
        }, 500)
      } else {
        // Com tenant_id = selecionar escola
        logger.info('User has tenant_id, redirecting to select school', 'CompleteProfile', {
          userId: data.user?.id,
          tenantId: data.user?.tenant_id,
        })
        setTimeout(() => {
          navigate('/selecionar-escola', { replace: true })
        }, 500)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao completar perfil'
      setError(errorMessage)
      logger.error('Failed to complete profile', errorMessage, 'CompleteProfile', {
        error: errorMessage,
        email: user?.email,
      })
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = () => {
    if (formData.given_name && formData.family_name) {
      return `${formData.given_name[0]}${formData.family_name[0]}`.toUpperCase()
    }
    return user?.email?.[0].toUpperCase() || '?'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar_url || (user?.user_metadata?.avatar_url || user?.user_metadata?.picture)} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">Complete seu Cadastro</CardTitle>
          <CardDescription>
            Precisamos de mais algumas informações sobre você
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="given_name">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="given_name"
                type="text"
                placeholder="João"
                value={formData.given_name}
                onChange={(e) => setFormData({ ...formData, given_name: e.target.value })}
                required
                disabled={isSubmitting}
                minLength={2}
                maxLength={50}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="family_name">
                Sobrenome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="family_name"
                type="text"
                placeholder="Silva"
                value={formData.family_name}
                onChange={(e) => setFormData({ ...formData, family_name: e.target.value })}
                required
                disabled={isSubmitting}
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">
                Avatar (URL) <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <Input
                id="avatar_url"
                type="url"
                placeholder="https://exemplo.com/avatar.jpg"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para usar a foto do Google
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Continuar
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-xs text-center text-muted-foreground">
            <p>Campos marcados com <span className="text-red-500">*</span> são obrigatórios</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
