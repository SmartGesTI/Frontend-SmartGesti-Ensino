import { Globe, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSchool } from '@/contexts/SchoolContext'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiRequest } from '@/services/api'
import { toast } from 'sonner'

interface Site {
  id: string
  name: string
  slug: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function MeusSites() {
  const { slug } = useParams<{ slug: string }>()
  const { school } = useSchool()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSites()
  }, [school])

  const loadSites = async () => {
    try {
      setLoading(true)
      const token = session?.access_token
      const data = await apiRequest<Site[]>(
        `/api/sites?projectId=ensino${school?.id ? `&schoolId=${school.id}` : ''}`,
        {
          method: 'GET',
        },
        token,
        school?.id
      )
      setSites(data || [])
    } catch (error) {
      console.error('Error loading sites:', error)
      toast.error('Erro ao carregar sites')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (siteId: string) => {
    if (!confirm('Tem certeza que deseja excluir este site?')) {
      return
    }

    try {
      const token = session?.access_token
      await apiRequest(
        `/api/sites/${siteId}?projectId=ensino`,
        {
          method: 'DELETE',
        },
        token,
        school?.id
      )

      toast.success('Site excluído com sucesso!')
      loadSites()
    } catch (error) {
      console.error('Error deleting site:', error)
      toast.error('Erro ao excluir site')
    }
  }

  const handleView = (siteId: string) => {
    window.open(`/escola/${slug}/site?id=${siteId}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-300">Carregando sites...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl border-2 border-border bg-card">
        <CardHeader className="bg-gradient-to-b from-pink-50/50 to-transparent dark:from-pink-950/30 dark:to-transparent">
          <div className="flex items-center justify-between">
            <CardTitle className="text-pink-600 dark:text-pink-400 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Meus Sites
            </CardTitle>
            <Button
              onClick={() => navigate(`/escola/${slug}/sites/novo`)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Site
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {sites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Nenhum site criado
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mb-4">
                Comece criando seu primeiro site para a escola.
              </p>
              <Button
                onClick={() => navigate(`/escola/${slug}/sites/novo`)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Site
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((site) => (
                <Card key={site.id} className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">
                          {site.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {site.slug}
                        </p>
                      </div>
                      {site.published && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                          Publicado
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/escola/${slug}/sites/${site.id}/editar`)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      {site.published && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(site.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(site.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
