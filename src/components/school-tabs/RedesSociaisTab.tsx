import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { School } from '@/types'
import { apiRequest } from '@/services/api'
import { useAccessToken } from '@/hooks/useAccessToken'
import { logger } from '@/lib/logger'

interface RedesSociaisTabProps {
  school: School
}

export function RedesSociaisTab({ school }: RedesSociaisTabProps) {
  const { token } = useAccessToken()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    facebook: school.facebook || '',
    instagram: school.instagram || '',
    twitter: school.twitter || '',
    youtube: school.youtube || '',
  })

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!token) throw new Error('No token available')
      return apiRequest<School>(
        `/api/schools/${school.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        },
        token,
        school.id
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school'] })
      logger.info('School social media updated', 'RedesSociaisTab', { schoolId: school.id })
      alert('Redes sociais atualizadas com sucesso!')
    },
    onError: (error: any) => {
      logger.error('Failed to update school social media', 'RedesSociaisTab', { error: error.message })
      alert(`Erro ao atualizar: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facebook" className="text-sm font-medium mb-1.5 block">Facebook</Label>
          <Input
            id="facebook"
            type="url"
            value={formData.facebook}
            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            placeholder="https://facebook.com/escola"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram" className="text-sm font-medium mb-1.5 block">Instagram</Label>
          <Input
            id="instagram"
            type="url"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            placeholder="https://instagram.com/escola"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter" className="text-sm font-medium mb-1.5 block">Twitter/X</Label>
          <Input
            id="twitter"
            type="url"
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            placeholder="https://twitter.com/escola"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube" className="text-sm font-medium mb-1.5 block">YouTube</Label>
          <Input
            id="youtube"
            type="url"
            value={formData.youtube}
            onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
            placeholder="https://youtube.com/@escola"
          />
        </div>
      </div>

      <Button type="submit" disabled={updateMutation.isPending} className="bg-emerald-500 hover:bg-emerald-600 text-white">
        {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  )
}
