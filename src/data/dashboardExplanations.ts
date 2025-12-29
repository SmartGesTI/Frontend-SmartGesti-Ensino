export interface DashboardSection {
  title: string
  content: string
  icon?: string
}

export interface DashboardExplanation {
  title: string
  description: string
  overview: string
  sections: DashboardSection[]
  tips: string[]
}

export const dashboardExplanations: Record<string, DashboardExplanation> = {
  'visao-geral': {
    title: 'Dashboard Visão Geral',
    description: 'Visão consolidada de todos os aspectos da escola em um único lugar',
    overview: 'O Dashboard Visão Geral oferece uma perspectiva completa da sua escola, reunindo informações acadêmicas, financeiras e operacionais em cards e gráficos interativos. Use este dashboard para ter uma visão rápida do estado geral da instituição.',
    sections: [
      {
        title: 'Estatísticas Principais',
        content: 'Os quatro cards no topo mostram os principais indicadores: Total de Alunos, Total de Professores, Total de Turmas e Frequência Geral. Cada card exibe o valor atual e a variação em relação ao período anterior, permitindo identificar tendências rapidamente.',
        icon: '📊'
      },
      {
        title: 'Gráfico de Evolução de Matrículas',
        content: 'O gráfico de área mostra a evolução do número de matrículas ao longo do tempo. Use-o para identificar períodos de maior crescimento, sazonalidade e tendências de longo prazo. Passe o mouse sobre os pontos para ver valores detalhados.',
        icon: '📈'
      },
      {
        title: 'Distribuição de Alunos por Série',
        content: 'O gráfico de pizza (ou rosca) exibe como os alunos estão distribuídos entre as diferentes séries/anos. Isso ajuda a entender a estrutura da escola e planejar recursos adequados para cada nível.',
        icon: '🥧'
      },
      {
        title: 'Próximos Eventos',
        content: 'A lista de eventos mostra os próximos compromissos importantes da escola, como reuniões de pais, eventos acadêmicos e atividades. Clique em um evento para ver mais detalhes ou adicionar novos eventos.',
        icon: '📅'
      },
      {
        title: 'Alertas e Avisos',
        content: 'Os alertas destacam situações que requerem atenção imediata, como alunos com frequência baixa, pendências financeiras ou documentos vencidos. Priorize a resolução dos alertas mais críticos.',
        icon: '⚠️'
      },
      {
        title: 'Atividades Recentes',
        content: 'A timeline de atividades mostra as últimas ações realizadas no sistema, como matrículas, atualizações de notas e alterações de dados. Use para acompanhar o fluxo de trabalho da equipe.',
        icon: '🕐'
      }
    ],
    tips: [
      'Use os filtros de período para analisar diferentes intervalos de tempo',
      'Clique nos gráficos para ver detalhes expandidos',
      'Configure alertas personalizados para receber notificações sobre eventos importantes',
      'Exporte os dados para relatórios externos usando os botões de exportação'
    ]
  },
  'academico': {
    title: 'Dashboard Acadêmico',
    description: 'Análise detalhada do desempenho acadêmico dos alunos e turmas',
    overview: 'O Dashboard Acadêmico foca exclusivamente nas métricas educacionais, oferecendo insights sobre desempenho, frequência, aprovação e recuperação dos alunos. Ideal para coordenadores pedagógicos e diretores acadêmicos.',
    sections: [
      {
        title: 'Média Geral e Taxa de Aprovação',
        content: 'Os indicadores principais mostram a média geral de notas de todos os alunos e a taxa de aprovação da escola. Compare com períodos anteriores para avaliar a evolução do desempenho acadêmico.',
        icon: '🎯'
      },
      {
        title: 'Desempenho por Turma',
        content: 'A tabela de desempenho por turma permite identificar quais turmas estão com melhor ou pior desempenho. Analise médias, frequência e número de alunos para tomar decisões pedagógicas direcionadas.',
        icon: '👥'
      },
      {
        title: 'Ranking de Alunos',
        content: 'A lista de alunos em destaque mostra os estudantes com melhor desempenho, incluindo suas médias e principais conquistas. Use para reconhecimento e motivação dos alunos.',
        icon: '⭐'
      },
      {
        title: 'Alunos em Recuperação',
        content: 'A lista de alunos em recuperação identifica estudantes que precisam de atenção especial. Veja as matérias com dificuldade e as notas que precisam ser melhoradas para aprovação.',
        icon: '📚'
      },
      {
        title: 'Gráficos de Distribuição',
        content: 'Os gráficos mostram como as notas estão distribuídas entre os alunos (excelente, bom, regular, etc.) e a distribuição por turma. Isso ajuda a identificar padrões e áreas que precisam de intervenção.',
        icon: '📊'
      }
    ],
    tips: [
      'Filtre por período letivo para análises mais precisas',
      'Use os gráficos para identificar turmas ou matérias que precisam de atenção',
      'Exporte relatórios acadêmicos para reuniões de pais e conselhos',
      'Configure alertas automáticos para alunos com desempenho abaixo da média'
    ]
  },
  'financeiro': {
    title: 'Dashboard Financeiro',
    description: 'Visão completa da situação financeira da escola',
    overview: 'O Dashboard Financeiro consolida todas as informações financeiras da escola, incluindo receitas, despesas, inadimplência e fluxo de caixa. Essencial para gestores financeiros e diretores administrativos.',
    sections: [
      {
        title: 'Receitas e Despesas',
        content: 'Os cards principais mostram o total de receitas (mensalidades, taxas, etc.) e despesas (salários, contas, etc.) do período. A diferença entre eles representa o resultado financeiro da escola.',
        icon: '💰'
      },
      {
        title: 'Taxa de Inadimplência',
        content: 'O indicador de inadimplência mostra a porcentagem de mensalidades em atraso. Valores altos indicam necessidade de ações de cobrança e negociação com os responsáveis.',
        icon: '📉'
      },
      {
        title: 'Fluxo de Caixa',
        content: 'O gráfico de fluxo de caixa mostra a entrada e saída de recursos ao longo do tempo. Use para planejar pagamentos, identificar períodos de maior movimento e garantir liquidez.',
        icon: '💹'
      },
      {
        title: 'Distribuição de Receitas',
        content: 'O gráfico de distribuição mostra de onde vêm as receitas (mensalidades, taxas de matrícula, serviços extras, etc.), ajudando a entender a composição financeira da escola.',
        icon: '🥧'
      },
      {
        title: 'Categorias de Despesas',
        content: 'Veja como as despesas estão distribuídas entre diferentes categorias (pessoal, infraestrutura, materiais, etc.). Isso ajuda a identificar oportunidades de economia e otimização.',
        icon: '📊'
      },
      {
        title: 'Previsões e Projeções',
        content: 'O dashboard pode incluir projeções futuras baseadas em dados históricos, ajudando no planejamento orçamentário e tomada de decisões estratégicas.',
        icon: '🔮'
      }
    ],
    tips: [
      'Configure alertas para quando a inadimplência ultrapassar limites definidos',
      'Use os filtros de período para análises mensais, trimestrais ou anuais',
      'Exporte relatórios financeiros para contadores e gestão',
      'Compare períodos diferentes para identificar tendências e sazonalidade',
      'Monitore o fluxo de caixa diariamente para evitar problemas de liquidez'
    ]
  }
}
