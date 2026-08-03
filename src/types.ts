export type TabType = 'simulados' | 'fixacao' | 'tutor' | 'painel' | 'mente' | 'rpg';

export type BankType = 'Cebraspe (CESPE)' | 'FGV' | 'Fundatec' | 'La Salle' | 'IBFC' | 'Vunesp';

export interface Question {
  id: string;
  subject: string;
  questionText: string;
  options: string[]; // Options or ['Certo', 'Errado']
  correctOptionIndex: number;
  explanation: string;
  lawReference?: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Oficial';
  bank?: BankType;
  questionFormat?: 'CEBRASPE_CE' | 'MULTIPLE_CHOICE'; // Certo/Errado or 5 Options
}

export interface Exam {
  id: string;
  title: string;
  subtitle: string;
  category: 'Policiais' | 'Prefeituras' | 'Administrativo' | 'Legislação' | 'Geral';
  bank: BankType;
  questionCount: number;
  level: string;
  description: string;
  icon: string;
  badge?: string;
  questions: Question[];
  completedPercentage?: number;
  isCebraspeFormat?: boolean; // 1 Errada anula 1 Certa
}

export interface Flashcard {
  id: string;
  deckName: string;
  front: string;
  back: string;
  lastReviewed?: string;
  masteryLevel?: number; // 0-100
  bankTarget?: string;
}

export interface Mnemonic {
  id: string;
  title: string;
  acronym: string;
  meaning: string;
  subject: string;
}

export interface BankMastery {
  cebraspe: number; // 0-100%
  fgv: number;
  ibfc: number;
  fundatec: number;
  vunesp: number;
  laSalle: number;
}

export interface CognitiveProfile {
  trapResistance: number; // 0-100 (Resistência a pegadinhas e pegadinhas de jurisprudência STF/STJ)
  lawTextPrecision: number; // 0-100 (Decoreba e precisão da Letra Seca da Lei para Prefeituras)
  jurisprudenceMastery: number; // 0-100 (Informativos STF/STJ)
  avgTimePerQuestionSec: number;
  mindShapeStage: string; // ex: "Mente Blindada Antipegadinha", "Afiado em Letra Seca (Fundatec)"
  cognitiveDiagnosis: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'simulados' | 'questoes' | 'banca' | 'ia';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rewardXp: number;
  rarity?: 'Comum' | 'Raro' | 'Épico' | 'Lendário';
}

export interface UserProfile {
  uid?: string;
  email?: string;
  googleConnected?: boolean;
  name: string;
  rank: string; // e.g., "Nível Recruta", "Cabo", "Sargento"
  nextRank: string;
  xp: number;
  maxXp: number;
  streakDays: number;
  highlightSubject: string;
  highlightAccuracy: number;
  dailyGoalMinutes: number;
  completedMinutesToday: number;
  strongSubjects: string[];
  weakSubjects: string[];
  totalStudyHours: number;
  totalStudyMinutes: number;
  rankTopPercentile: number;
  avatarUrl: string;
  totalQuestionsAnswered?: number;
  correctQuestionsCount?: number;
  targetExamType?: 'Policiais' | 'Prefeituras' | 'Ambos';
  bankMastery?: BankMastery;
  cognitiveProfile?: CognitiveProfile;
  unlockedBadgeIds?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  badge?: string;
  actions?: string[];
  legalConcept?: boolean;
}
