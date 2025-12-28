import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { School } from '@/types'
import { apiRequest } from '@/services/api'
import { useAccessToken } from '@/hooks/useAccessToken'
import { logger } from '@/lib/logger'

interface ContatosTabProps {
  school: School
}

export function ContatosTab({ school }: ContatosTabProps) {
  const { token } = useAccessToken()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    email: school.email || '',
    phone: school.phone || '',
    whatsapp: school.whatsapp || '',
    website: school.website || '',
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
      logger.info('School contact data updated', 'ContatosTab', { schoolId: school.id })
      alert('Contatos atualizados com sucesso!')
    },
    onError: (error: any) => {
      logger.error('Failed to update school contact data', 'ContatosTab', { error: error.message })
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contato@escola.com.br"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(11) 3456-7890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="(11) 98765-4321"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://www.escola.com.br"
          />
        </div>
      </div>

      <Button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  )
}
