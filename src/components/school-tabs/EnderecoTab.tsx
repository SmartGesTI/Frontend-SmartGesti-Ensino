import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { School } from '@/types'
import { apiRequest } from '@/services/api'
import { useAccessToken } from '@/hooks/useAccessToken'
import { logger } from '@/lib/logger'

interface EnderecoTabProps {
  school: School
}

export function EnderecoTab({ school }: EnderecoTabProps) {
  const { token } = useAccessToken()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    endereco_rua: school.endereco_rua || '',
    endereco_numero: school.endereco_numero || '',
    endereco_complemento: school.endereco_complemento || '',
    endereco_bairro: school.endereco_bairro || '',
    endereco_cidade: school.endereco_cidade || '',
    endereco_estado: school.endereco_estado || '',
    endereco_cep: school.endereco_cep || '',
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
      logger.info('School address updated', 'EnderecoTab', { schoolId: school.id })
      alert('Endereço atualizado com sucesso!')
    },
    onError: (error: any) => {
      logger.error('Failed to update school address', 'EnderecoTab', { error: error.message })
      alert(`Erro ao atualizar: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco_rua">Rua/Logradouro</Label>
          <Input
            id="endereco_rua"
            value={formData.endereco_rua}
            onChange={(e) => setFormData({ ...formData, endereco_rua: e.target.value })}
            placeholder="Rua Principal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco_numero">Número</Label>
          <Input
            id="endereco_numero"
            value={formData.endereco_numero}
            onChange={(e) => setFormData({ ...formData, endereco_numero: e.target.value })}
            placeholder="123"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco_complemento">Complemento</Label>
          <Input
            id="endereco_complemento"
            value={formData.endereco_complemento}
            onChange={(e) => setFormData({ ...formData, endereco_complemento: e.target.value })}
            placeholder="Sala 101"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco_bairro">Bairro</Label>
          <Input
            id="endereco_bairro"
            value={formData.endereco_bairro}
            onChange={(e) => setFormData({ ...formData, endereco_bairro: e.target.value })}
            placeholder="Centro"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco_cep">CEP</Label>
          <Input
            id="endereco_cep"
            value={formData.endereco_cep}
            onChange={(e) => setFormData({ ...formData, endereco_cep: e.target.value })}
            placeholder="01310-100"
            maxLength={9}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco_cidade">Cidade</Label>
          <Input
            id="endereco_cidade"
            value={formData.endereco_cidade}
            onChange={(e) => setFormData({ ...formData, endereco_cidade: e.target.value })}
            placeholder="São Paulo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco_estado">Estado (UF)</Label>
          <Input
            id="endereco_estado"
            value={formData.endereco_estado}
            onChange={(e) => setFormData({ ...formData, endereco_estado: e.target.value.toUpperCase() })}
            placeholder="SP"
            maxLength={2}
          />
        </div>
      </div>

      <Button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  )
}
