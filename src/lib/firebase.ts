import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with specific databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export interface StudentProgressData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  levelName: string;
  xp: number;
  maxXp: number;
  streakDays: number;
  totalQuestionsAnswered: number;
  correctQuestionsCount: number;
  completedMinutesToday: number;
  dailyGoalMinutes: number;
  targetExamType: 'Policiais' | 'Prefeituras' | 'Ambos';
  targetExamName: string;
  bankMastery: {
    cebraspe: number; // 0-100%
    fgv: number;
    ibfc: number;
    fundatec: number;
    vunesp: number;
    laSalle: number;
  };
  cognitiveProfile: {
    trapResistance: number; // 0-100 (Resistência a Pegadinhas Doutrinárias/Jurisprudência x Texto Seco)
    lawTextPrecision: number; // 0-100 (Precisão de Letra da Lei)
    jurisprudenceMastery: number; // 0-100 (Entendimento STF/STJ)
    avgTimePerQuestionSec: number;
    mindShapeStage: string; // Ex: "Mente Metódica Cebraspe", "Afiado em Texto da Lei", "Estrategista FGV"
    cognitiveDiagnosis: string;
  };
  updatedAt?: any;
}

// Default initial student data
export const defaultStudentData = (user: FirebaseUser): StudentProgressData => ({
  uid: user.uid,
  email: user.email || '',
  displayName: user.displayName || 'Estudante Focado',
  photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
  levelName: 'Recruta Policial/Municipal',
  xp: 1250,
  maxXp: 2000,
  streakDays: 4,
  totalQuestionsAnswered: 84,
  correctQuestionsCount: 68,
  completedMinutesToday: 25,
  dailyGoalMinutes: 45,
  targetExamType: 'Ambos',
  targetExamName: 'Polícia Penal & Concurso Prefeitura (Gravataí/POA)',
  bankMastery: {
    cebraspe: 72,
    fgv: 64,
    ibfc: 80,
    fundatec: 88,
    vunesp: 75,
    laSalle: 82,
  },
  cognitiveProfile: {
    trapResistance: 78,
    lawTextPrecision: 85,
    jurisprudenceMastery: 69,
    avgTimePerQuestionSec: 82,
    mindShapeStage: 'Em Moldagem Cognitiva Ativa',
    cognitiveDiagnosis: 'Você tem ótima assimilação da letra seca da lei (padrão Fundatec/LaSalle). O foco atual da IA é treinar seu viés comportamental no Cebraspe (C/E) e casos práticos da FGV.',
  },
});

// Auth helper functions
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

// Sync user profile to Firestore
export async function syncUserProfile(user: FirebaseUser, existingData?: Partial<StudentProgressData>): Promise<StudentProgressData> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data() as StudentProgressData;
    // ensure email and displayName updated if changed in google
    const updated = {
      ...data,
      displayName: user.displayName || data.displayName,
      photoURL: user.photoURL || data.photoURL,
      updatedAt: serverTimestamp(),
      ...existingData
    };
    await updateDoc(userRef, updated);
    return updated;
  } else {
    // create initial profile
    const initial = {
      ...defaultStudentData(user),
      ...existingData,
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(userRef, initial);
    return initial;
  }
}

// Record exam execution & trigger mind shaping calculation
export async function saveExamResultToFirestore(
  uid: string, 
  examTitle: string, 
  bank: string, 
  score: number, 
  total: number, 
  xpEarned: number,
  timeSpentSec: number = 300
) {
  try {
    // 1. Add attempt to subcollection
    const attemptsRef = collection(db, 'users', uid, 'simulados');
    await addDoc(attemptsRef, {
      examTitle,
      bank,
      score,
      total,
      xpEarned,
      accuracyPercent: Math.round((score / total) * 100),
      timeSpentSec,
      completedAt: new Date().toISOString()
    });

    // 2. Update user stats & cognitive profile
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const current = snap.data() as StudentProgressData;
      const accuracy = score / total;
      const newXp = current.xp + xpEarned;
      const newQuestionsAnswered = current.totalQuestionsAnswered + total;
      const newCorrectQuestions = current.correctQuestionsCount + score;

      // Update bank mastery based on bank
      const bankKey = bank.toLowerCase().includes('cebraspe') || bank.toLowerCase().includes('cespe') ? 'cebraspe' :
                      bank.toLowerCase().includes('fgv') ? 'fgv' :
                      bank.toLowerCase().includes('ibfc') ? 'ibfc' :
                      bank.toLowerCase().includes('fundatec') ? 'fundatec' :
                      bank.toLowerCase().includes('vunesp') ? 'vunesp' : 'laSalle';

      const currentBankMastery = current.bankMastery[bankKey] || 70;
      // Weighted moving average
      const updatedBankMasteryVal = Math.min(100, Math.max(10, Math.round(currentBankMastery * 0.7 + (accuracy * 100) * 0.3)));

      const updatedBankMastery = {
        ...current.bankMastery,
        [bankKey]: updatedBankMasteryVal
      };

      // Mind shaping adjustment based on performance
      let trap = current.cognitiveProfile.trapResistance;
      let lawPrec = current.cognitiveProfile.lawTextPrecision;
      let juris = current.cognitiveProfile.jurisprudenceMastery;

      if (bankKey === 'cebraspe') {
        trap = Math.min(100, Math.max(20, Math.round(trap + (accuracy > 0.7 ? 3 : -2))));
      } else if (bankKey === 'fundatec' || bankKey === 'laSalle' || bankKey === 'ibfc') {
        lawPrec = Math.min(100, Math.max(20, Math.round(lawPrec + (accuracy > 0.7 ? 3 : -2))));
      } else if (bankKey === 'fgv') {
        juris = Math.min(100, Math.max(20, Math.round(juris + (accuracy > 0.7 ? 4 : -2))));
      }

      let mindShapeStage = 'Mente Concurseira em Formação';
      if (trap > 80 && lawPrec > 80) mindShapeStage = 'Mente Blindada Antipegadinha';
      else if (lawPrec > 85) mindShapeStage = 'Especialista em Letra Seca da Lei (Prefeituras)';
      else if (trap > 82) mindShapeStage = 'Estrategista de Provas de Nível Superior e Policiais';

      const updatedData: Partial<StudentProgressData> = {
        xp: newXp,
        totalQuestionsAnswered: newQuestionsAnswered,
        correctQuestionsCount: newCorrectQuestions,
        bankMastery: updatedBankMastery,
        cognitiveProfile: {
          ...current.cognitiveProfile,
          trapResistance: trap,
          lawTextPrecision: lawPrec,
          jurisprudenceMastery: juris,
          mindShapeStage,
          cognitiveDiagnosis: `Análise recente (${bank}): Desempenho de ${Math.round(accuracy * 100)}%. Sua mente está absorvendo os padrões da banca ${bank.toUpperCase()}.`
        },
        updatedAt: serverTimestamp()
      };

      await updateDoc(userRef, updatedData);

      // Log mind shaping event
      const logsRef = collection(db, 'users', uid, 'cognitiveLogs');
      await addDoc(logsRef, {
        timestamp: new Date().toISOString(),
        triggerEvent: `Simulado Concluído: ${examTitle} (${bank})`,
        patternDetected: accuracy > 0.75 ? 'Excelente assimilação de pegadinhas' : 'Nervosismo ou dúvida pontual na marcação',
        recommendation: accuracy > 0.75 ? 'Manter ritmo de revisões espaçadas' : 'Reforçar os flashcards de conceitos divergentes'
      });
    }
  } catch (err) {
    console.error('Erro ao salvar resultado de simulado no Firestore:', err);
  }
}
