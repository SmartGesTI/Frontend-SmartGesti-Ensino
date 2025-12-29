import { useEffect, useRef, useState } from 'react'
import { templateCategories } from '../mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

interface AgentTemplatesProps {
  onLoadTemplate: (template: any) => void
  selectedTemplateId?: string
}

export function AgentTemplates({ onLoadTemplate, selectedTemplateId }: AgentTemplatesProps) {
  const templateRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['academico'])

  // Encontrar a categoria do template selecionado e expandir
  useEffect(() => {
    if (selectedTemplateId) {
      const category = templateCategories.find((cat) =>
        cat.templates.some((t) => t.id === selectedTemplateId)
      )
      if (category) {
        setExpandedCategories((prev) => {
          if (!prev.includes(category.id)) {
            return [...prev, category.id]
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
  }, [selectedTemplateId])

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
                      ({category.templates.length} templates)
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {category.templates.map((template) => {
                    const Icon = template.icon
                    const isSelected = selectedTemplateId === template.id
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
                            <Button
                              size="sm"
                              onClick={() => onLoadTemplate(template)}
                              className={cn('text-white text-xs h-7', colorClass.button)}
                            >
                              Usar Template
                            </Button>
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
