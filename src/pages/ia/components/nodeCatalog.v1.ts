import { Brain, FileSpreadsheet, FileText, Filter, MessageCircle, Zap } from 'lucide-react'
import type { NodeDefinition } from './AgentBuilder/types'

/**
 * Node Catalog V1 (minimal)
 *
 * Goal: keep the Builder n8n-like but focused on real report flows:
 * Entrada (inputs) -> Agentes (IA processors) -> Saída (Markdown -> PDF)
 *
 * IMPORTANT: ids/nodeTypes must stay stable because they are used to map backend execution.
 */
export const availableNodesV1: NodeDefinition[] = [
  // ENTRADA
  {
    id: 'receive-document',
    type: 'input',
    category: 'ENTRADA',
    data: {
      label: 'Receber Documento',
      icon: FileText,
      color: 'blue',
      description: 'Recebe arquivos PDF, Word ou Excel para análise',
      config: {
        acceptedFormats: ['pdf', 'docx', 'xlsx'],
        maxSize: '10MB',
      },
    },
  },
  {
    id: 'receive-text',
    type: 'input',
    category: 'ENTRADA',
    data: {
      label: 'Receber Texto',
      icon: MessageCircle,
      color: 'blue',
      description: 'Recebe texto digitado pelo usuário',
      config: {
        maxLength: 5000,
      },
    },
  },

  // AGENTES - Modelo padrão: gpt-4.1 (rápido e econômico)
  {
    id: 'analyze-text',
    type: 'ai',
    category: 'AGENTES',
    data: {
      label: 'Analisar Texto',
      icon: Brain,
      color: 'purple',
      description: 'Analisa texto usando IA e extrai informações',
      config: {
        model: 'gpt-4.1',
      },
    },
  },
  {
    id: 'analyze-document',
    type: 'ai',
    category: 'AGENTES',
    data: {
      label: 'Analisar Documento',
      icon: FileText,
      color: 'purple',
      description: 'Analisa documentos (PDF, Word, Excel) usando IA',
      config: {
        model: 'gpt-4.1',
      },
    },
  },
  {
    id: 'extract-information',
    type: 'ai',
    category: 'AGENTES',
    data: {
      label: 'Extrair Informações',
      icon: Zap,
      color: 'purple',
      description: 'Extrai informações estruturadas de texto ou documentos',
      config: {
        model: 'gpt-4.1',
      },
    },
  },
  {
    id: 'classify-data',
    type: 'ai',
    category: 'AGENTES',
    data: {
      label: 'Classificar Dados',
      icon: Filter,
      color: 'purple',
      description: 'Classifica e categoriza dados automaticamente',
      config: {
        model: 'gpt-4.1',
      },
    },
  },
  {
    id: 'generate-summary',
    type: 'ai',
    category: 'AGENTES',
    data: {
      label: 'Gerar Relatório (Markdown)',
      icon: FileText,
      color: 'purple',
      description: 'Gera um relatório em Markdown pronto para virar PDF',
      config: {
        model: 'gpt-4.1-mini',
        maxLength: 500,
      },
    },
  },

  // SAÍDA
  {
    id: 'generate-report',
    type: 'output',
    category: 'SAIDA',
    data: {
      label: 'Gerar Relatório',
      icon: FileSpreadsheet,
      color: 'emerald',
      description: 'Gera relatório em formato PDF',
      config: {
        format: 'pdf',
      },
    },
  },
]
