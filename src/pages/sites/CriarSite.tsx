import { LandingPageEditorV2, SiteDocumentV2, createEmptySiteDocumentV2 } from '@brunoalz/smartgesti-site-editor'
// Importar CSS da landing page
import '@brunoalz/smartgesti-site-editor/styles/landing-page.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useSchool } from '@/contexts/SchoolContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { apiRequest } from '@/services/api'
import { useEffect, useState } from 'react'

export default function CriarSite() {
  const { slug, siteId } = useParams<{ slug: string; siteId?: string }>()
  const { school } = useSchool()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState<SiteDocumentV2 | null>(null)
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(siteId || null)

  // Carregar site se estiver editando
  useEffect(() => {
    if (siteId) {
      loadSite(siteId)
      setCurrentSiteId(siteId)
    } else {
      // Se não tem siteId, criar documento vazio V2
      setInitialData(createEmptySiteDocumentV2('Novo Site'))
    }
  }, [siteId])

  const loadSite = async (id: string) => {
    try {
      const token = session?.access_token
      const data = await apiRequest<any>(
        `/api/sites/${id}?projectId=ensino`,
        {
          method: 'GET',
        },
        token,
        school?.id
      )
      
      // Sempre esperar SiteDocumentV2
      if (data.template) {
        // Verificar se é V2
        if (data.template.schemaVersion === 2) {
          setInitialData(data.template as SiteDocumentV2)
        } else {
          // V1 legado - criar novo documento vazio
          toast.warning('Site em formato legado. Criando novo documento.')
          setInitialData(createEmptySiteDocumentV2('Novo Site'))
        }
      } else {
        setInitialData(createEmptySiteDocumentV2('Novo Site'))
      }
    } catch (error) {
      console.error('Error loading site:', error)
      toast.error('Erro ao carregar site')
      setInitialData(createEmptySiteDocumentV2('Novo Site'))
    }
  }

  const handleSave = async (data: SiteDocumentV2) => {
    try {
      const token = session?.access_token
      const isUpdate = currentSiteId
      
      // Preparar dados para salvar (sempre V2)
      const siteName = data.pages[0]?.name || 'Landing Page'
      const siteSlug = data.pages[0]?.slug || `landing-${Date.now()}`
      
      const siteData = {
        name: siteName,
        slug: siteSlug,
        projectId: 'ensino',
        schoolId: school?.id,
        template: data, // Salvar SiteDocumentV2
      }

      const response = await apiRequest<any>(
        isUpdate ? `/api/sites/${currentSiteId}?projectId=ensino` : '/api/sites',
        {
          method: isUpdate ? 'PUT' : 'POST',
          body: JSON.stringify({
            ...siteData,
            pages: [], // Array vazio, usando template agora
          }),
        },
        token,
        school?.id
      )

      toast.success('Landing page salva com sucesso!')
      
      // Se for criação, redirecionar para edição
      if (!isUpdate && response.id) {
        setCurrentSiteId(response.id)
        navigate(`/escola/${slug}/sites/${response.id}/editar`)
      }
      
      return response
    } catch (error) {
      console.error('Error saving site:', error)
      toast.error('Erro ao salvar landing page')
      throw error
    }
  }

  const handlePublish = async (_data: SiteDocumentV2) => {
    if (!currentSiteId) {
      toast.error('Salve a landing page antes de publicar')
      return
    }

    try {
      const token = session?.access_token
      const response = await apiRequest<any>(
        `/api/sites/${currentSiteId}/publish?projectId=ensino`,
        {
          method: 'POST',
        },
        token,
        school?.id
      )

      toast.success('Landing page publicada com sucesso!')
      return response
    } catch (error) {
      console.error('Error publishing site:', error)
      toast.error('Erro ao publicar landing page')
      throw error
    }
  }

  if (!initialData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Carregando editor...</div>
      </div>
    )
  }

  return (
    <div className="h-[91vh] max-h-[91vh] -m-4 lg:-m-6 overflow-hidden">
      <LandingPageEditorV2
        initialData={initialData}
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </div>
  )
}
