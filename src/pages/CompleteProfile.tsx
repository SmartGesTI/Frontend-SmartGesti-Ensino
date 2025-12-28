import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertCircle, Loader2, User as UserIcon, Upload, X, Image as ImageIcon } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useState, useRef } from 'react'
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    setAvatarFile(file)
    
    // Criar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    // Limpar URL antiga
    setFormData({ ...formData, avatar_url: '' })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
        hasAvatarFile: !!avatarFile,
      })

      // Se houver arquivo, fazer upload primeiro para Supabase Storage
      let avatarUrl = formData.avatar_url.trim() || undefined
      
      if (avatarFile && user?.id) {
        try {
          logger.info('Uploading avatar to Supabase Storage', 'CompleteProfile', {
            userId: user.id,
            fileName: avatarFile.name,
            fileSize: avatarFile.size,
          })

          // Gerar nome único para o arquivo: userId/timestamp-nomearquivo
          const fileExt = avatarFile.name.split('.').pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          
          // Fazer upload para Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, {
              cacheControl: '3600',
              upsert: false, // Não sobrescrever, criar novo arquivo
            })

          if (uploadError) {
            logger.error('Failed to upload avatar', uploadError.message, 'CompleteProfile', {
              error: uploadError,
            })
            throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`)
          }

          // Obter URL pública do arquivo
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

          avatarUrl = publicUrl
          
          logger.info('Avatar uploaded successfully', 'CompleteProfile', {
            fileName,
            publicUrl,
          })
        } catch (uploadErr: any) {
          logger.error('Avatar upload exception', uploadErr.message, 'CompleteProfile', {
            error: uploadErr,
          })
          throw new Error(`Erro ao fazer upload da imagem: ${uploadErr.message}`)
        }
      }

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
          avatar_url: avatarUrl,
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
      // IMPORTANTE: Se for owner, já deve ter tenant_id vinculado automaticamente
      // Se não tiver tenant_id, verificar se é owner antes de redirecionar para aprovação
      if (!data.user?.tenant_id) {
        // Verificar se é owner de algum tenant
        try {
          const statusResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/status`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                ...(tenantSubdomain && { 'x-tenant-id': tenantSubdomain }),
              },
            }
          )
          
          if (statusResponse.ok) {
            const status = await statusResponse.json()
            
            // Se for owner, recarregar dados do usuário para pegar tenant_id atualizado
            if (status.isOwner) {
              logger.info('User is owner, reloading user data to get tenant_id', 'CompleteProfile', {
                userId: data.user?.id,
              })
              
              // Aguardar um pouco e recarregar dados do usuário
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              // Redirecionar para selecionar escola (o SelectSchool vai verificar novamente)
              navigate('/selecionar-escola', { replace: true })
              return
            }
          }
        } catch (statusError) {
          logger.warn('Failed to check owner status', 'CompleteProfile', { error: statusError })
        }
        
        // Sem tenant_id e não é owner = aguardando aprovação
        logger.info('User has no tenant_id and is not owner, redirecting to pending approval', 'CompleteProfile', {
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-gray-200 bg-white">
        <CardHeader className="text-center bg-gray-100/50 pb-6 pt-8 px-8 border-b-2 border-gray-200 space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={avatarPreview || formData.avatar_url || (user?.user_metadata?.avatar_url || user?.user_metadata?.picture)} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-600">Complete seu Cadastro</CardTitle>
          <CardDescription className="text-base text-gray-600">
            Precisamos de mais algumas informações sobre você
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {error && (
            <Alert variant="destructive" className="mb-6 animate-in fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="given_name" className="text-sm font-medium mb-1.5 block" required>
                Nome
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
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="family_name" className="text-sm font-medium mb-1.5 block" required>
                Sobrenome
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
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium mb-1.5 block">
                Foto de Perfil <span className="text-gray-500 text-xs font-normal">(opcional)</span>
              </Label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isSubmitting}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {avatarPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <img 
                        src={avatarPreview} 
                        alt="Preview" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveAvatar()
                        }}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Clique para trocar a imagem
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Arraste uma imagem aqui ou clique para selecionar
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG ou GIF até 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {avatarFile && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {avatarFile.name} ({(avatarFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={isSubmitting}
              size="sm"
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

          <div className="mt-6 text-xs text-center text-gray-500">
            <p>Campos marcados com <span className="text-red-600 font-bold">*</span> são obrigatórios</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
