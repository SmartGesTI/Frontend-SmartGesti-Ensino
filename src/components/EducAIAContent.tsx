import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Sparkles, 
  MessageCircle, 
  Wand2, 
  Bot, 
  Grid3x3, 
  UserCircle,
  Search,
  HelpCircle,
  BookOpen,
  Lightbulb,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AIButton } from '@/components/ui/ai-button'
import { useCurrentPage } from '@/hooks/useCurrentPage'
import { dashboardExplanations } from '@/data/dashboardExplanations'
import { faqData } from '@/data/faqData'
import { cn } from '@/lib/utils'

interface IAPage {
  name: string
  description: string
  icon: typeof MessageCircle
  path: string
  color: string
}

const iaPages: IAPage[] = [
  {
    name: 'Assistente IA',
    description: 'Converse com o assistente inteligente',
    icon: MessageCircle,
    path: '/ia/assistente',
    color: 'purple'
  },
  {
    name: 'Relatório Inteligente',
    description: 'Gere relatórios personalizados com IA',
    icon: Wand2,
    path: '/ia/relatorio',
    color: 'purple'
  },
  {
    name: 'Criar Agente IA',
    description: 'Crie agentes personalizados visualmente',
    icon: Bot,
    path: '/ia/criar',
    color: 'purple'
  },
  {
    name: 'Ver Agentes',
    description: 'Explore templates de agentes disponíveis',
    icon: Grid3x3,
    path: '/ia/agentes',
    color: 'purple'
  },
  {
    name: 'Meus Agentes',
    description: 'Gerencie seus agentes criados',
    icon: UserCircle,
    path: '/ia/meus-agentes',
    color: 'purple'
  }
]

interface EducAIAContentProps {
  onClose?: () => void
  closePanel?: () => void
}

export function EducAIAContent({ onClose, closePanel }: EducAIAContentProps) {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { isDashboard, dashboardType, pageName } = useCurrentPage()
  const [showExplanation, setShowExplanation] = useState(false)
  const [faqSearch, setFaqSearch] = useState('')
  const [activeTab, setActiveTab] = useState('help')

  const handleIAPageClick = (path: string) => {
    if (slug) {
      navigate(`/escola/${slug}${path}`)
      onClose?.()
      closePanel?.()
    }
  }

  const handleWhatAmISeeing = () => {
    if (isDashboard && dashboardType) {
      setShowExplanation(true)
    }
  }

  const explanation = dashboardType ? dashboardExplanations[dashboardType] : null

  // Filtrar FAQ por busca
  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      q.answer.toLowerCase().includes(faqSearch.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="p-6 space-y-6 overflow-y-auto flex-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">EducaIA</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Central de Inteligência Artificial</p>
          </div>
        </div>
      </div>

      {/* Cards de Acesso Rápido */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-3">
          {iaPages.map((page) => {
            const Icon = page.icon
            return (
              <Card
                key={page.path}
                className="cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all"
                onClick={() => handleIAPageClick(page.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                        {page.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {page.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Botão "O que eu estou Vendo" */}
      <div>
        <AIButton
          variant="aiPrimary"
          onClick={handleWhatAmISeeing}
          shimmer
          iconPulse
          className="w-full gap-2"
          disabled={!isDashboard}
        >
          <Lightbulb className="w-4 h-4 icon-swing-on-hover" />
          {isDashboard 
            ? `O que eu estou vendo: ${pageName}`
            : 'Você não está visualizando um dashboard no momento'
          }
        </AIButton>
      </div>

      {/* Tabs: Ajuda e FAQ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-gray-100/50 dark:bg-gray-800/50">
          <TabsTrigger value="help" className="flex-1">
            <HelpCircle className="w-4 h-4 mr-2" />
            Ajuda
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex-1">
            <BookOpen className="w-4 h-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="mt-4 space-y-4">
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Como usar o EducaIA
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                O EducaIA é seu assistente inteligente para automatizar tarefas e obter insights. 
                Use o Assistente IA para conversar, crie agentes personalizados para tarefas específicas 
                ou gere relatórios inteligentes com um clique.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Dicas Rápidas
              </h4>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
                <li>Use templates prontos de agentes para começar rapidamente</li>
                <li>O botão "O que eu estou vendo" explica o dashboard atual</li>
                <li>Agentes podem ser públicos ou privados</li>
                <li>Exporte relatórios em PDF ou Excel</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Recursos Disponíveis
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div>• Assistente Conversacional</div>
                <div>• Geração de Relatórios</div>
                <div>• Agentes Personalizados</div>
                <div>• Análise de Dados</div>
                <div>• Processamento de Documentos</div>
                <div>• Automação de Tarefas</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar perguntas..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFAQ.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Nenhuma pergunta encontrada.</p>
              </div>
            ) : (
              filteredFAQ.map((category) => (
                <div key={category.category}>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    {category.icon && <span>{category.icon}</span>}
                    {category.category}
                  </h4>
                  <Accordion type="single" className="w-full">
                    {category.questions.map((item, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-600 dark:text-gray-400">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Explicação do Dashboard */}
      <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
        {explanation && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{explanation.title}</DialogTitle>
              <DialogDescription className="text-base">
                {explanation.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Visão Geral</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {explanation.overview}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Seções do Dashboard</h3>
                <div className="space-y-4">
                  {explanation.sections.map((section, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        {section.icon && <span>{section.icon}</span>}
                        {section.title}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {explanation.tips && explanation.tips.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Dicas de Uso
                  </h3>
                  <ul className="space-y-2">
                    {explanation.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
