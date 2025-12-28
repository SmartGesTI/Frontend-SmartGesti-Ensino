import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { School } from '@/types'
import { apiRequest } from '@/services/api'
import { useAccessToken } from '@/hooks/useAccessToken'
import { logger } from '@/lib/logger'

interface DadosGeraisTabProps {
  school: School
}

export function DadosGeraisTab({ school }: DadosGeraisTabProps) {
  const { token } = useAccessToken()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: school.name || '',
    code: school.code || '',
    cnpj: school.cnpj || '',
    descricao: school.descricao || '',
    logo_url: school.logo_url || '',
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
      queryClient.invalidateQueries({ queryKey: ['schools-all'] })
      logger.info('School general data updated', 'DadosGeraisTab', { schoolId: school.id })
      alert('Dados gerais atualizados com sucesso!')
    },
    onError: (error: any) => {
      logger.error('Failed to update school general data', 'DadosGeraisTab', { error: error.message })
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
          <Label htmlFor="name">Nome da Escola *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">URL da Logo</Label>
          <Input
            id="logo_url"
            type="url"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          rows={4}
          placeholder="Descrição da escola..."
        />
      </div>

      <Button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  )
}
