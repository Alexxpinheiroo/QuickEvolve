import { Exam, Flashcard, Mnemonic, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
  uid: 'demo-user-123',
  email: 'estudante@google.com',
  googleConnected: false,
  name: 'Gabriel Concurseiro',
  rank: 'Recruta Policial/Municipal',
  nextRank: 'Cabo',
  xp: 2450,
  maxXp: 3000,
  streakDays: 7,
  highlightSubject: 'Legislação Especial & Letra Seca',
  highlightAccuracy: 82,
  dailyGoalMinutes: 60,
  completedMinutesToday: 45,
  strongSubjects: ['Língua Portuguesa', 'Direito Constitucional', 'Direito Penal'],
  weakSubjects: ['Raciocínio Lógico', 'Informática', 'Doutrina x Jurisprudência'],
  totalStudyHours: 28,
  totalStudyMinutes: 30,
  rankTopPercentile: 5,
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=GabrielConcurseiro',
  totalQuestionsAnswered: 142,
  correctQuestionsCount: 116,
  targetExamType: 'Ambos',
  bankMastery: {
    cebraspe: 74,
    fgv: 68,
    ibfc: 82,
    fundatec: 89,
    vunesp: 81,
    laSalle: 85,
  },
  cognitiveProfile: {
    trapResistance: 76,
    lawTextPrecision: 88,
    jurisprudenceMastery: 72,
    avgTimePerQuestionSec: 75,
    mindShapeStage: 'Mente Adaptativa Multibancas',
    cognitiveDiagnosis: 'Você demonstra altíssimo desempenho na letra seca da lei (padrão Fundatec/LaSalle). O foco da IA agora é acelerar sua resposta nas questões Certo/Errado do Cebraspe.',
  },
};

export const sampleExams: Exam[] = [
  {
    id: 'policia-penal-rs-2024',
    title: 'Polícia Penal RS - SUSEPE',
    subtitle: 'Simulado Edital Nacional / Estadual',
    category: 'Policiais',
    bank: 'Cebraspe (CESPE)',
    isCebraspeFormat: true,
    questionCount: 80,
    level: 'Nível Oficial',
    description: 'Estilo Certo/Errado (1 errada anula 1 certa). Foco na Lei de Execução Penal, Direito Penal e pegadinhas de jurisprudência do STF/STJ.',
    icon: 'policy',
    badge: 'CEBRASPE C/E',
    completedPercentage: 43,
    questions: [
      {
        id: 'ceb-1',
        subject: 'Lei de Execução Penal (LEP)',
        questionText: '(Cebraspe / Certo ou Errado) Conforme a Lei de Execução Penal (Lei 7.210/84) e orientação do STF, o cometimento de falta grave pelo condenado extingue automaticamente a totalidade dos dias remidos.',
        options: ['Certo (A afirmativa está correta)', 'Errado (A afirmativa está incorreta)'],
        correctOptionIndex: 1,
        explanation: 'ERRADO. O Art. 127 da LEP (redação pela Lei 12.433/2011) e a Súmula Vinculante 9 do STF estabelecem que a revogação decorrente de falta grave limita-se a ATÉ 1/3 (um terço) do tempo remido, não a totalidade.',
        lawReference: 'Art. 127 da Lei 7.210/84 e SV 9 do STF',
        difficulty: 'Oficial',
        bank: 'Cebraspe (CESPE)',
        questionFormat: 'CEBRASPE_CE'
      },
      {
        id: 'ceb-2',
        subject: 'Direito Penal',
        questionText: '(Cebraspe / Certo ou Errado) No crime de concussão, a consumação ocorre no momento em que o funcionário público efetivamente recebe a vantagem indevida exigida.',
        options: ['Certo (A afirmativa está correta)', 'Errado (A afirmativa está incorreta)'],
        correctOptionIndex: 1,
        explanation: 'ERRADO. O crime de concussão (Art. 316 do CP) é crime FORMAL (ou de consumação antecipada). Consuma-se com a simples EXIGÊNCIA da vantagem. O recebimento posterior é mero exaurimento do crime (Súmula 96 do STJ).',
        lawReference: 'Art. 316 do Código Penal / Súmula 96 do STJ',
        difficulty: 'Médio',
        bank: 'Cebraspe (CESPE)',
        questionFormat: 'CEBRASPE_CE'
      },
      {
        id: 'ceb-3',
        subject: 'Direito Administrativo',
        questionText: '(Cebraspe / Certo ou Errado) O princípio da eficiência foi incluído no caput do artigo 37 da Constituição Federal desde a sua promulgação em 1988.',
        options: ['Certo (A afirmativa está correta)', 'Errado (A afirmativa está incorreta)'],
        correctOptionIndex: 1,
        explanation: 'ERRADO. O princípio da eficiência foi inserido no caput do Art. 37 pela Emenda Constitucional nº 19/1998 (Reforma Administrativa). A redação original de 1988 continha apenas LIMP (Legalidade, Impessoalidade, Moralidade, Publicidade).',
        lawReference: 'Art. 37 da CF/88 e EC 19/1998',
        difficulty: 'Fácil',
        bank: 'Cebraspe (CESPE)',
        questionFormat: 'CEBRASPE_CE'
      }
    ]
  },
  {
    id: 'prefeitura-gravatai-poa-2024',
    title: 'Concurso Prefeitura (Municipal)',
    subtitle: 'Fundatec & La Salle',
    category: 'Prefeituras',
    bank: 'Fundatec',
    questionCount: 50,
    level: 'Nível Médio e Superior',
    description: 'Provas típicas de Prefeituras Gaúchas (Fundatec, La Salle, Legalle). Foco 100% na letra seca da Lei Orgânica, Regime Jurídico Único e Língua Portuguesa.',
    icon: 'location_city',
    badge: 'PREFEITURAS',
    completedPercentage: 70,
    questions: [
      {
        id: 'fund-1',
        subject: 'Língua Portuguesa (Fundatec)',
        questionText: 'Assinale a alternativa que apresenta a regência verbal e o uso da crase de forma TOTALMENTE CORRETA conforme a norma-padrão:',
        options: [
          'O servidor prestou informações à qualquer cidadão que solicitou.',
          'A comissão de licitação deu início à reunião às 9 horas da manhã.',
          'Solicitou à Secretária de Saúde que comparecesse à partir de amanhã.',
          'O Prefeito referiu-se à ela durante a sessão solene da Câmara.',
          'Estava disposto à colaborar com a fiscalização municipal.'
        ],
        correctOptionIndex: 1,
        explanation: 'CORRETO. "dar início à reunião" (junção de preposição "a" com artigo "a") e "às 9 horas" (crase obrigatória antes de horas exatas). Erros nas demais: não há crase antes de "qualquer", "a partir de" (verbo), "ela" (pronome) e "colaborar" (verbo).',
        lawReference: 'Sintaxe de Regência e Crase (Padrão Fundatec)',
        difficulty: 'Médio',
        bank: 'Fundatec',
        questionFormat: 'MULTIPLE_CHOICE'
      },
      {
        id: 'fund-2',
        subject: 'Direito Administrativo Municipal',
        questionText: 'De acordo com a Lei de Improbidade Administrativa (Lei nº 8.429/1992, com redação da Lei nº 14.230/2021), para a configuração de ato de improbidade administrativa exige-se comprovadamente:',
        options: [
          'Apenas a comprovação de culpa grave ou imprudência do agente.',
          'A demonstração do elemento subjetivo dolo.',
          'Responsabilidade objetiva do agente público, independente de dolo ou culpa.',
          'Decisão administrativa condenatória irrecorrível do Tribunal de Contas.',
          'Parecer prévio favorável da Procuradoria-Geral do Município.'
        ],
        correctOptionIndex: 1,
        explanation: 'CORRETO. A reforma da Lei 14.230/2021 revogou a modalidade culposa na Improbidade Administrativa. Exige-se agora dolo específico do agente público.',
        lawReference: 'Art. 1º, § 1º da Lei 8.429/92 (redação dada pela Lei 14.230/21)',
        difficulty: 'Médio',
        bank: 'Fundatec',
        questionFormat: 'MULTIPLE_CHOICE'
      }
    ]
  },
  {
    id: 'fgv-casos-praticos',
    title: 'Simulado Avançado FGV',
    subtitle: 'Casos Práticos & Interpretação',
    category: 'Geral',
    bank: 'FGV',
    questionCount: 40,
    level: 'Nível Superior',
    description: 'Enunciados longos, casos concretos e português sofisticado estilo FGV para Analistas e Agentes.',
    icon: 'balance',
    badge: 'ESTRUTURA FGV',
    questions: [
      {
        id: 'fgv-1',
        subject: 'Direito Constitucional (FGV)',
        questionText: 'Determinada lei estadual aprovada pela Assembleia Legislativa concedeu isenção tributária a servidores públicos da segurança pública. Diante disso, o Governador do Estado ajuizou Ação Direta de Inconstitucionalidade no STF. Nesse cenário, nos termos da jurisprudência do STF:',
        options: [
          'O Governador possui legitimidade ativa universal, não necessitando demonstrar pertinência temática.',
          'O Governador é legitimado especial, exigindo-se a demonstração de pertinência temática.',
          'Apenas o Procurador-Geral da República poderia ajuizar a ADI perante o STF.',
          'Leis estaduais só podem ser objeto de ADI no Tribunal de Justiça local.',
          'A ação é inadmissível por falta de interesse de agir.'
        ],
        correctOptionIndex: 0,
        explanation: 'CORRETO. O Governador de Estado é legitimado ativo UNIVERSAL para propor ADI no STF (Art. 103, V da CF), não necessitando demonstrar pertinência temática (diferente de confederações sindicais ou entidades de classe).',
        lawReference: 'Art. 103, V da CF/88 e Jurisprudência do STF',
        difficulty: 'Difícil',
        bank: 'FGV',
        questionFormat: 'MULTIPLE_CHOICE'
      }
    ]
  }
];

export const sampleFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    deckName: 'Direito Penal: Crimes contra a Adm. Pública',
    front: 'Diferença fundamental entre CONCUSSÃO e CORRUPÇÃO PASSIVA:',
    back: '• Concussão (Art. 316): EXIGIR vantagem indevida.\n• Corrupção Passiva (Art. 317): SOLICITAR, RECEBER ou ACEITAR promessa de vantagem.',
    masteryLevel: 75
  },
  {
    id: 'fc-2',
    deckName: 'Lei de Execução Penal',
    front: 'Qual o limite de perda dos dias remidos na FALTA GRAVE?',
    back: 'Até 1/3 (um terço) do tempo remido. Decisão judicial motivada (Art. 127 LEP / Lei 12.433/11).',
    masteryLevel: 60
  },
  {
    id: 'fc-3',
    deckName: 'Direito Administrativo',
    front: 'Quais os atributos do Ato Administrativo? (Mnemônico PATI)',
    back: 'P - Presunção de Legitimidade\nA - Autoexecutoriedade\nT - Tipicidade\nI - Imperatividade',
    masteryLevel: 90
  },
  {
    id: 'fc-4',
    deckName: 'Legislação Especial',
    front: 'O usuário de drogas (Art. 28 da Lei 11.343/06) pode ser preso em flagrante?',
    back: 'NÃO. Não gera pena privativa de liberdade e não admite prisão em flagrante. O condutor lavra Termo Circunstanciado.',
    masteryLevel: 85
  }
];

export const sampleMnemonics: Mnemonic[] = [
  {
    id: 'mn-1',
    title: 'Princípios da Administração Pública',
    acronym: 'LIMPE',
    meaning: 'Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência (Art. 37, CF)',
    subject: 'Direito Administrativo'
  },
  {
    id: 'mn-2',
    title: 'Atributos do Ato Administrativo',
    acronym: 'PATI',
    meaning: 'Presunção de legitimidade, Autoexecutoriedade, Tipicidade, Imperatividade',
    subject: 'Direito Administrativo'
  },
  {
    id: 'mn-3',
    title: 'Requisitos de Validade do Ato',
    acronym: 'CO-FI-FO-MO-OB',
    meaning: 'Competência, Finalidade, Forma, Motivo, Objeto',
    subject: 'Direito Administrativo'
  },
  {
    id: 'mn-4',
    title: 'Garantias do Art. 5º da CF',
    acronym: 'VLPSI',
    meaning: 'Vida, Liberdade, Igualdade (Paridade), Segurança, Propriedade',
    subject: 'Direito Constitucional'
  }
];
