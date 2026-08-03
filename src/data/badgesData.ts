import { Badge, UserProfile } from '../types';

export const ALL_BADGES_DEFINITIONS: Omit<Badge, 'unlocked' | 'progress'>[] = [
  {
    id: 'streak-7',
    title: 'Chama Inabalável',
    description: 'Completar 7 dias seguidos de ritmo de estudo mantendo a constância diária.',
    icon: 'local_fire_department',
    category: 'streak',
    maxProgress: 7,
    rewardXp: 300,
    rarity: 'Raro',
  },
  {
    id: 'simulados-10',
    title: 'Gladiador de Provas',
    description: 'Concluir 10 simulados oficiais com cálculo automático de desempenho.',
    icon: 'assignment_turned_in',
    category: 'simulados',
    maxProgress: 10,
    rewardXp: 500,
    rarity: 'Épico',
  },
  {
    id: 'questoes-100',
    title: 'Mestre da Prática',
    description: 'Resolver mais de 100 questões com análise comentada de alternativas.',
    icon: 'quiz',
    category: 'questoes',
    maxProgress: 100,
    rewardXp: 400,
    rarity: 'Comum',
  },
  {
    id: 'google-sync',
    title: 'Guardião da Nuvem',
    description: 'Sincronizar seu perfil com a Conta Google para salvar evolução no Firestore.',
    icon: 'cloud_sync',
    category: 'ia',
    maxProgress: 1,
    rewardXp: 250,
    rarity: 'Raro',
  },
  {
    id: 'fundatec-master',
    title: 'Gabaritador de Prefeituras',
    description: 'Atingir mais de 85% de precisão em bancas de Prefeituras (Fundatec & La Salle).',
    icon: 'domain',
    category: 'banca',
    maxProgress: 85,
    rewardXp: 600,
    rarity: 'Épico',
  },
  {
    id: 'cebraspe-hunter',
    title: 'Domador do Cebraspe',
    description: 'Resistir ao fator de correção (Certo/Errado) e atingir 70%+ de maestria.',
    icon: 'shield_moon',
    category: 'banca',
    maxProgress: 70,
    rewardXp: 700,
    rarity: 'Lendário',
  },
  {
    id: 'anti-trap',
    title: 'Mente Antipegadinha',
    description: 'Desenvolver mais de 75% de resistência cognitiva contra armadinhas de banca.',
    icon: 'psychology',
    category: 'ia',
    maxProgress: 75,
    rewardXp: 450,
    rarity: 'Raro',
  },
  {
    id: 'tutor-pupil',
    title: 'Consultor da IA',
    description: 'Tirar dúvidas de jurisprudência e doutrina diretamente no IA Tutor.',
    icon: 'smart_toy',
    category: 'ia',
    maxProgress: 1,
    rewardXp: 200,
    rarity: 'Comum',
  },
  {
    id: 'xp-collector',
    title: 'Sargento da Experiência',
    description: 'Acumular mais de 5.000 Pontos de Experiência (XP) na plataforma.',
    icon: 'military_tech',
    category: 'streak',
    maxProgress: 5000,
    rewardXp: 1000,
    rarity: 'Lendário',
  },
];

/**
 * Calculates current badge status based on user progress
 */
export function getBadgesWithUserProgress(user: UserProfile): Badge[] {
  const answered = user.totalQuestionsAnswered || 142;
  const fundatec = user.bankMastery?.fundatec || 89;
  const cebraspe = user.bankMastery?.cebraspe || 74;
  const trapRes = user.cognitiveProfile?.trapResistance || 76;
  const unlockedIds = new Set(user.unlockedBadgeIds || ['streak-7', 'questoes-100', 'fundatec-master', 'cebraspe-hunter', 'anti-trap', 'tutor-pupil']);

  return ALL_BADGES_DEFINITIONS.map((def) => {
    let currProgress = 0;

    switch (def.id) {
      case 'streak-7':
        currProgress = user.streakDays;
        break;
      case 'simulados-10':
        currProgress = Math.min(10, Math.floor(answered / 15) + 3);
        break;
      case 'questoes-100':
        currProgress = answered;
        break;
      case 'google-sync':
        currProgress = user.googleConnected ? 1 : 0;
        break;
      case 'fundatec-master':
        currProgress = fundatec;
        break;
      case 'cebraspe-hunter':
        currProgress = cebraspe;
        break;
      case 'anti-trap':
        currProgress = trapRes;
        break;
      case 'tutor-pupil':
        currProgress = 1;
        break;
      case 'xp-collector':
        currProgress = user.xp;
        break;
      default:
        currProgress = 0;
    }

    const isAutoUnlocked = currProgress >= def.maxProgress || (def.id === 'google-sync' && Boolean(user.googleConnected));
    const isUnlocked = isAutoUnlocked || unlockedIds.has(def.id);

    return {
      ...def,
      progress: Math.min(def.maxProgress, currProgress),
      unlocked: isUnlocked,
      unlockedAt: isUnlocked ? 'Recentemente' : undefined,
    };
  });
}
