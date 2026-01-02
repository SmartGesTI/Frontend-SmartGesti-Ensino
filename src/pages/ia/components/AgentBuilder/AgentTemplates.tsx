import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAgents } from '@/hooks/useAgents'
import { categoryInfoMap } from '@/services/agents.utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { Loader2, Globe, Users, Copy, Pencil } from 'lucide-react'

// Categorias de templates (baseado nas categorias do banco)
const templateCategories = [
  {
    id: 'academico',
    name: 'Acadêmico',
    icon: categoryInfoMap.academico.icon,
    color: categoryInfoMap.academico.color,
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: categoryInfoMap.financeiro.icon,
    color: categoryInfoMap.financeiro.color,
  },
  {
    id: 'rh',
    name: 'Recursos Humanos',
    icon: categoryInfoMap.rh.icon,
    color: categoryInfoMap.rh.color,
  },
  {
    id: 'administrativo',
    name: 'Administrativo',
    icon: categoryInfoMap.administrativo.icon,
    color: categoryInfoMap.administrativo.color,
  },
]

interface AgentTemplatesProps {
  onLoadTemplate: (template: any, isUsingTemplate?: boolean) => void
  selectedTemplateId?: string
}

export function AgentTemplates({ onLoadTemplate, selectedTemplateId }: AgentTemplatesProps) {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const templateRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['academico'])

  // Buscar templates públicos e colaborativos da API
  const { data: publicAgents = [], isLoading: isLoadingPublic } = useAgents({ visibility: 'public', status: 'published' })
  const { data: collaborativeAgents = [], isLoading: isLoadingCollab } = useAgents({ visibility: 'public_collaborative', status: 'published' })
  
  // Combinar e marcar tipo de cada template
  const templates = useMemo(() => {
    const publicWithType = publicAgents.map(t => ({ ...t, visibilityType: 'public' as const }))
    const collabWithType = collaborativeAgents.map(t => ({ ...t, visibilityType: 'public_collaborative' as const }))
    return [...publicWithType, ...collabWithType]
  }, [publicAgents, collaborativeAgents])
  
  const isLoading = isLoadingPublic || isLoadingCollab

  // Agrupar templates por categoria
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, typeof templates> = {}
    templates.forEach((template) => {
      if (!grouped[template.category]) {
        grouped[template.category] = []
      }
      grouped[template.category].push(template)
    })
    return grouped
  }, [templates])

  // Encontrar a categoria do template selecionado e expandir
  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      const template = templates.find((t) => t.id === selectedTemplateId)
      if (template) {
        const categoryId = template.category
        setExpandedCategories((prev) => {
          if (!prev.includes(categoryId)) {
            return [...prev, categoryId]
          }
          return prev
        })
      }

      // Scroll para o template selecionado após um pequeno delay
      setTimeout(() => {
        const templateElement = templateRefs.current[selectedTemplateId]
        if (templateElement) {
          templateElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }, [selectedTemplateId, templates])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Carregando templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Templates de Agentes
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Comece com um template pré-configurado
        </p>
      </div>

      <Accordion 
        type="multiple" 
        value={expandedCategories}
        onValueChange={(value) => setExpandedCategories(Array.isArray(value) ? value : [value])}
        className="w-full"
      >
        {templateCategories.map((category) => {
          const CategoryIcon = category.icon
          const colorClasses: Record<string, { bg: string; text: string; button: string }> = {
            purple: {
              bg: 'bg-purple-100 dark:bg-purple-900/30',
              text: 'text-purple-600 dark:text-purple-400',
              button: 'bg-purple-500 hover:bg-purple-600',
            },
            emerald: {
              bg: 'bg-emerald-100 dark:bg-emerald-900/30',
              text: 'text-emerald-600 dark:text-emerald-400',
              button: 'bg-emerald-500 hover:bg-emerald-600',
            },
            amber: {
              bg: 'bg-amber-100 dark:bg-amber-900/30',
              text: 'text-amber-600 dark:text-amber-400',
              button: 'bg-amber-500 hover:bg-amber-600',
            },
            blue: {
              bg: 'bg-blue-100 dark:bg-blue-900/30',
              text: 'text-blue-600 dark:text-blue-400',
              button: 'bg-blue-500 hover:bg-blue-600',
            },
          }
          const colorClass = colorClasses[category.color] || colorClasses.purple

          return (
            <AccordionItem key={category.id} value={category.id} className="border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colorClass.bg)}>
                    <CategoryIcon className={cn('w-4 h-4', colorClass.text)} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({(templatesByCategory[category.id] || []).length} templates)
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {(templatesByCategory[category.id] || []).map((template: any) => {
                    const Icon = template.icon
                    const isSelected = selectedTemplateId === template.id
                    const isCollaborative = template.visibilityType === 'public_collaborative'
                    
                    return (
                      <Card
                        key={template.id}
                        ref={(el) => {
                          templateRefs.current[template.id] = el
                        }}
                        className={cn(
                          "hover:shadow-md transition-all cursor-pointer border-2 hover:scale-[1.02]",
                          isSelected
                            ? "border-purple-500 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/30 shadow-md"
                            : "border-gray-200 dark:border-gray-700"
                        )}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClass.bg)}>
                                <Icon className={cn('w-4 h-4', colorClass.text)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm">{template.name}</CardTitle>
                              </div>
                            </div>
                            {/* Badge de tipo */}
                            <Badge 
                              variant="outline" 
                              className={cn(
                                'text-[10px] px-1.5 py-0 h-5 flex items-center gap-1',
                                isCollaborative 
                                  ? 'border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400' 
                                  : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400'
                              )}
                            >
                              {isCollaborative ? (
                                <><Users className="w-3 h-3" /> Colaborativo</>
                              ) : (
                                <><Globe className="w-3 h-3" /> Público</>
                              )}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs mt-2">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {template.nodes.length} nós • {template.edges.length} conexões
                            </span>
                            <div className="flex items-center gap-1">
                              {/* Botão Usar Template - sempre visível */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Limpar URL de edição se existir e carregar como template novo
                                  if (slug) {
                                    navigate(`/escola/${slug}/ia/criar`, { replace: true })
                                    // Aguardar navegação e então carregar template
                                    // O template será carregado sem dados gerais (limpo)
                                    // Passar true para isUsingTemplate para limpar dados
                                    setTimeout(() => {
                                      onLoadTemplate(template, true)
                                    }, 100)
                                  } else {
                                    // Passar true para isUsingTemplate para limpar dados
                                    onLoadTemplate(template, true)
                                  }
                                }}
                                className="text-xs h-7 gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Copiar fluxo para o editor (criar nova versão)"
                              >
                                <Copy className="w-3 h-3" />
                                Usar
                              </Button>
                              {/* Botão Editar - apenas para colaborativos */}
                              {isCollaborative && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (slug) {
                                      navigate(`/escola/${slug}/ia/criar?edit=${template.id}`)
                                    }
                                  }}
                                  className={cn('text-white text-xs h-7 gap-1', colorClass.button)}
                                  title="Editar este template colaborativo"
                                >
                                  <Pencil className="w-3 h-3" />
                                  Editar
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
