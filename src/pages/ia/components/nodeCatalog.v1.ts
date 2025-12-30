import { FileSpreadsheet, FileText, Filter, MessageCircle, UserSearch, Zap } from 'lucide-react'
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
        instructions: `ENTRADA: Você recebe UMA STRING com o texto extraído de um documento (PDF/DOCX/XLSX) OU um JSON (stringificado). Se receber JSON, extraia o conteúdo na seguinte ordem de prioridade: 1) extracted_text 2) text 3) content. Se nada existir, use o JSON inteiro como texto.
PROCESSAMENTO: Analise o conteúdo do documento. Identifique a estrutura, seções principais, pontos-chave, datas e valores importantes. Produza um relatório bem escrito e estruturado, em Português (pt-BR), com formatação em Markdown.
REGRAS: Use APENAS Markdown (sem HTML). Use 1 título principal com #, subseções com ## e listas com -. Não use blocos de código. Não inclua JSON no corpo do Markdown.
ESTRUTURA: # Análise do Documento\n\n## Resumo\n(parágrafo)\n\n## Estrutura Identificada\n- ...\n\n## Pontos-Chave\n- ...\n\n## Informações Extraídas\n- ...
SAÍDA: Retorne APENAS JSON válido, sem texto extra. Formato: {"title":"Análise do Documento","markdown":"..."}`,
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
        instructions: `ENTRADA: Você recebe UMA STRING com texto OU um JSON (stringificado) vindo do nó anterior. Se receber JSON, extraia o conteúdo na seguinte ordem de prioridade: 1) text 2) content 3) extracted_text. Se nada existir, use o JSON inteiro como texto.
PROCESSAMENTO: Extraia informações estruturadas do texto (datas, valores monetários, nomes, empresas, endereços, emails, telefones, CPFs/CNPJs). Produza um relatório bem escrito e estruturado, em Português (pt-BR), com formatação em Markdown.
REGRAS: Use APENAS Markdown (sem HTML). Use 1 título principal com #, subseções com ## e listas com -. Não use blocos de código. Não inclua JSON no corpo do Markdown.
ESTRUTURA: # Informações Extraídas\n\n## Resumo\n(parágrafo)\n\n## Dados Encontrados\n### Datas\n- ...\n### Valores\n- ...\n### Pessoas/Empresas\n- ...\n### Contatos\n- ...
SAÍDA: Retorne APENAS JSON válido, sem texto extra. Formato: {"title":"Informações Extraídas","markdown":"..."}`,
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
        instructions: `ENTRADA: Você recebe UMA STRING com texto OU um JSON (stringificado) vindo do nó anterior. Se receber JSON, extraia o conteúdo na seguinte ordem de prioridade: 1) text 2) content 3) extracted_text. Se nada existir, use o JSON inteiro como texto.
PROCESSAMENTO: Classifique o conteúdo em categorias (Acadêmico, Financeiro, Administrativo, RH, etc.) e identifique o tema principal. Produza um relatório bem escrito e estruturado, em Português (pt-BR), com formatação em Markdown.
REGRAS: Use APENAS Markdown (sem HTML). Use 1 título principal com #, subseções com ## e listas com -. Não use blocos de código. Não inclua JSON no corpo do Markdown.
ESTRUTURA: # Classificação de Dados\n\n## Categoria Principal\n(categoria e justificativa)\n\n## Subcategorias\n- ...\n\n## Palavras-Chave Identificadas\n- ...\n\n## Análise\n(parágrafo)
SAÍDA: Retorne APENAS JSON válido, sem texto extra. Formato: {"title":"Classificação de Dados","markdown":"..."}`,
      },
    },
  },
  {
    id: 'generate-summary',
    type: 'ai',
    category: 'AGENTES',
    data: {
      label: 'Gerar Resumo',
      icon: FileText,
      color: 'purple',
      description: 'Gera resumo automático de textos longos',
      config: {
        model: 'gpt-4.1-mini',
        instructions: `ENTRADA: Você recebe UMA STRING com texto OU um JSON (stringificado) vindo do nó anterior. Se receber JSON, extraia o conteúdo na seguinte ordem de prioridade: 1) markdown 2) text 3) content 4) extracted_text 5) summary. Se nada existir, use o JSON inteiro como texto (string).
PROCESSAMENTO: Produza um relatório bem escrito e estruturado, em Português (pt-BR), com formatação em Markdown. O resultado será convertido para PDF.
REGRAS: Use APENAS Markdown (sem HTML). Use 1 título principal com #, subseções com ## e listas com -. Não use blocos de código. Não inclua JSON no corpo do Markdown.
ESTRUTURA: # Relatório\n\n## Resumo\n(parágrafo)\n\n## Pontos-Chave\n- ...\n\n## Observações\n- ...
SAÍDA: Retorne APENAS JSON válido, sem texto extra. Formato: {"title":"Relatório","markdown":"..."}`,
      },
    },
  },

  // AGENTES DE RH
  {
    id: 'analyze-curriculum',
    type: 'ai',
    category: 'AGENTES DE RH',
    data: {
      label: 'Analisar Currículum',
      icon: UserSearch,
      color: 'amber',
      description: 'Analisa currículos e extrai informações do candidato',
      config: {
        model: 'gpt-5-mini',
        instructions: `ENTRADA: Você recebe o texto extraído de um currículo (PDF/DOCX). Se receber JSON, extraia o conteúdo na seguinte ordem de prioridade: 1) extracted_text 2) text 3) content.

REGRA CRÍTICA - NÃO INVENTAR DADOS:
- USE APENAS informações que ESTÃO EXPLICITAMENTE no currículo
- Se uma informação NÃO EXISTE no currículo, escreva "Não informado" ou omita a seção
- NUNCA invente emails, telefones, endereços, empresas, datas ou qualquer outro dado
- NUNCA faça suposções sobre dados faltantes
- Seja FIEL ao conteúdo original do currículo

PROCESSAMENTO: Analise o currículo de forma profissional. Extraia e organize APENAS as informações que realmente existem no documento. Produza um relatório bem estruturado em Português (pt-BR) com formatação Markdown.

INFORMAÇÕES A EXTRAIR (somente se existirem no CV):
- Dados Pessoais: Nome, email, telefone, localização, LinkedIn (APENAS se informados)
- Objetivo Profissional: Se declarado
- Formação Acadêmica: Cursos, instituições, datas exatas conforme o CV
- Experiência Profissional: Empresas REAIS mencionadas, cargos, períodos, atividades
- Habilidades Técnicas: Tecnologias e ferramentas MENCIONADAS no CV
- Idiomas: APENAS os listados no CV com os níveis informados
- Certificações: APENAS as mencionadas no CV
- Avaliação: Pontos fortes e de atenção baseados NO QUE ESTÁ NO CV

REGRAS DE FORMATAÇÃO: Use APENAS Markdown (sem HTML). Use # para título, ## para seções e - para listas. Não use blocos de código.

ESTRUTURA:
# Análise de Currículo - [Nome do Candidato]

## Dados do Candidato
- Nome: [exatamente como no CV]
- LinkedIn: [se informado, ou "Não informado"]
- Email: [se informado, ou "Não informado"]
- Telefone: [se informado, ou "Não informado"]

## Resumo do Perfil
[Resumo baseado no que o candidato escreveu sobre si]

## Formação Acadêmica
[Listar exatamente como no CV]

## Experiência Profissional
### [Empresa Real] ([período real])
- Cargo: [cargo real]
- Atividades: [atividades mencionadas]

## Habilidades Técnicas
[Tecnologias listadas no CV]

## Idiomas
[Idiomas e níveis conforme CV]

## Avaliação
### Pontos Fortes
[Baseado no CV]
### Pontos de Atenção
[Baseado no CV, não inventar]

SAÍDA: Retorne APENAS JSON válido, sem texto extra. Formato: {"title":"Análise de Currículo - [Nome]","markdown":"..."}`,
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
