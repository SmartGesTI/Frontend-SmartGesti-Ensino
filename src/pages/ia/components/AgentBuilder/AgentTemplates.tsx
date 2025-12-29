import { templateCategories } from '../mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

interface AgentTemplatesProps {
  onLoadTemplate: (template: any) => void
}

export function AgentTemplates({ onLoadTemplate }: AgentTemplatesProps) {
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

      <Accordion type="multiple" defaultValue={['academico']} className="w-full">
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
                    return (
                      <Card
                        key={template.id}
                        className="hover:shadow-md transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:scale-[1.02]"
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
