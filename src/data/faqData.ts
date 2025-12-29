export interface FAQItem {
  question: string
  answer: string
}

export interface FAQCategory {
  category: string
  icon?: string
  questions: FAQItem[]
}

export const faqData: FAQCategory[] = [
  {
    category: 'Geral',
    icon: '📋',
    questions: [
      {
        question: 'Como faço para alterar minha senha?',
        answer: 'Acesse o menu do usuário (canto superior direito) e clique em "Perfil". Na seção de segurança, você encontrará a opção para alterar sua senha. Você precisará informar sua senha atual e a nova senha desejada.'
      },
      {
        question: 'Como altero entre diferentes escolas?',
        answer: 'Use o seletor de escola no canto superior direito do navbar. Clique nele e escolha a escola desejada. O sistema recarregará automaticamente com os dados da escola selecionada.'
      },
      {
        question: 'Como personalizo as notificações?',
        answer: 'Acesse Configurações > Notificações. Lá você pode escolher quais tipos de notificações deseja receber e como deseja recebê-las (email, push, etc.).'
      },
      {
        question: 'O sistema funciona offline?',
        answer: 'Não, o SmartGesti Ensino é uma aplicação web que requer conexão com a internet para funcionar. Algumas funcionalidades podem ser acessadas em modo de leitura com cache, mas a maioria das operações precisa de conexão ativa.'
      },
      {
        question: 'Como exporto dados para Excel ou PDF?',
        answer: 'A maioria das páginas com tabelas e relatórios possui botões de exportação. Procure por ícones de download ou botões "Exportar" nas páginas de relatórios, dashboards e listagens.'
      }
    ]
  },
  {
    category: 'IA e Automação',
    icon: '🤖',
    questions: [
      {
        question: 'O que é o Assistente IA?',
        answer: 'O Assistente IA é um chatbot inteligente que pode ajudá-lo com dúvidas sobre o sistema, explicar funcionalidades, gerar relatórios e automatizar tarefas. Você pode conversar com ele em linguagem natural.'
      },
      {
        question: 'Como crio um agente de IA personalizado?',
        answer: 'Acesse "Criar Agente IA" no menu EducaIA. Lá você encontrará templates prontos e poderá criar workflows visuais arrastando e soltando componentes. Os agentes podem processar documentos, analisar dados e gerar resultados automaticamente.'
      },
      {
        question: 'Posso usar os agentes de IA para gerar relatórios?',
        answer: 'Sim! Existem templates específicos para geração de relatórios. Você pode usar o "Gerador de Relatórios Personalizados" ou criar seu próprio agente customizado para gerar relatórios específicos das suas necessidades.'
      },
      {
        question: 'Os agentes de IA são seguros?',
        answer: 'Sim, todos os agentes seguem protocolos de segurança. Os dados são processados de forma segura e você pode configurar permissões para controlar quem pode usar cada agente. Agentes privados são visíveis apenas para você.'
      },
      {
        question: 'Como faço para compartilhar um agente com outros usuários?',
        answer: 'Na página "Meus Agentes", você pode alternar um agente entre público e privado. Agentes públicos ficam disponíveis na galeria para outros usuários da escola utilizarem.'
      }
    ]
  },
  {
    category: 'Acadêmico',
    icon: '🎓',
    questions: [
      {
        question: 'Como adiciono uma nova turma?',
        answer: 'Acesse "Turmas" no menu Acadêmico e clique em "Nova Turma". Preencha as informações necessárias como nome, série, período e capacidade de alunos.'
      },
      {
        question: 'Como faço a matrícula de um novo aluno?',
        answer: 'Vá em "Matrículas" > "Nova Matrícula" e preencha os dados do aluno e responsáveis. Você precisará anexar os documentos necessários e selecionar a turma desejada.'
      },
      {
        question: 'Como lanço notas dos alunos?',
        answer: 'Acesse a turma desejada e vá na seção de avaliações. Lá você pode lançar notas por matéria, tipo de avaliação e período. O sistema calcula automaticamente as médias.'
      },
      {
        question: 'Como gero boletins escolares?',
        answer: 'Você pode gerar boletins individualmente na página do aluno ou em lote usando o agente IA "Gerador de Boletins". O sistema calcula automaticamente as médias e valida aprovação/reprovação.'
      },
      {
        question: 'Como controlo a frequência dos alunos?',
        answer: 'Na página da turma, há uma seção de frequência onde você pode marcar presenças e faltas. O sistema calcula automaticamente a porcentagem de frequência e gera alertas quando necessário.'
      }
    ]
  },
  {
    category: 'Financeiro',
    icon: '💰',
    questions: [
      {
        question: 'Como configuro os valores de mensalidade?',
        answer: 'Acesse Configurações > Financeiro > Mensalidades. Lá você pode definir valores por série, aplicar descontos e configurar regras de cobrança. Use o agente IA "Calculador de Mensalidades" para automatizar isso.'
      },
      {
        question: 'Como registro um pagamento recebido?',
        answer: 'Na página Financeiro, você pode registrar pagamentos manualmente ou usar o agente IA "Validador de Pagamentos" para processar comprovantes automaticamente. Basta anexar o comprovante e o sistema extrai as informações.'
      },
      {
        question: 'Como gero relatórios financeiros?',
        answer: 'No Dashboard Financeiro, você encontra vários relatórios prontos. Também pode usar o "Relatório Inteligente" para criar relatórios personalizados ou o agente IA "Analisador Financeiro" para análises mais profundas.'
      },
      {
        question: 'Como controlo a inadimplência?',
        answer: 'O Dashboard Financeiro mostra a taxa de inadimplência em tempo real. Você pode configurar alertas automáticos e usar o agente IA "Gerador de Cobrança" para enviar lembretes automaticamente aos responsáveis.'
      },
      {
        question: 'Posso exportar dados para contabilidade?',
        answer: 'Sim, na página de Relatórios Financeiros você pode exportar dados em Excel ou PDF formatados para contadores. Os relatórios incluem todas as informações necessárias para a contabilidade.'
      }
    ]
  },
  {
    category: 'Permissões e Acesso',
    icon: '🔐',
    questions: [
      {
        question: 'Como concedo permissões para outros usuários?',
        answer: 'Acesse "Permissões" no menu Administração. Lá você pode atribuir funções (roles) aos usuários ou criar permissões customizadas. Cada função tem um conjunto específico de permissões.'
      },
      {
        question: 'O que são roles e permissões?',
        answer: 'Roles são grupos de permissões pré-definidos (ex: Diretor, Professor, Secretário). Permissões são ações específicas que um usuário pode realizar. Você pode criar roles customizados combinando diferentes permissões.'
      },
      {
        question: 'Como removo o acesso de um usuário?',
        answer: 'Em "Equipe" > "Usuários", você pode desativar ou remover usuários. Desativar mantém os dados históricos mas impede novos acessos. Remover exclui completamente o usuário do sistema.'
      },
      {
        question: 'Posso limitar o acesso a dados de uma escola específica?',
        answer: 'Sim, ao atribuir permissões, você pode definir em quais escolas cada usuário tem acesso. Usuários só verão dados das escolas às quais têm permissão.'
      }
    ]
  },
  {
    category: 'Relatórios',
    icon: '📊',
    questions: [
      {
        question: 'Como gero um relatório personalizado?',
        answer: 'Use a página "Relatório Inteligente" no menu EducaIA. Lá você pode escolher o tipo de relatório, definir filtros, períodos e parâmetros. O sistema gera o relatório automaticamente com IA.'
      },
      {
        question: 'Quais formatos de exportação estão disponíveis?',
        answer: 'A maioria dos relatórios pode ser exportada em PDF, Excel (XLSX) e alguns em CSV. O formato disponível depende do tipo de relatório.'
      },
      {
        question: 'Posso agendar relatórios para serem gerados automaticamente?',
        answer: 'Sim, em alguns relatórios você pode configurar agendamento. Acesse as configurações do relatório e defina a frequência (diária, semanal, mensal). Os relatórios serão gerados e enviados automaticamente.'
      },
      {
        question: 'Como compartilho um relatório com outros usuários?',
        answer: 'Após gerar um relatório, você pode compartilhá-lo via link ou exportar e enviar por email. Alguns relatórios também podem ser salvos na biblioteca de documentos para acesso posterior.'
      }
    ]
  }
]
