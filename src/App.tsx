import React, { useState, useEffect } from 'react';
import { TabType, Exam, Mnemonic, UserProfile } from './types';
import { initialUserProfile, sampleExams, sampleFlashcards, sampleMnemonics } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CentralSimuladosView } from './components/CentralSimuladosView';
import { MemorizacaoView } from './components/MemorizacaoView';
import { IATutorChatView } from './components/IATutorChatView';
import { PainelConcurseiroView } from './components/PainelConcurseiroView';
import { MindShaperView } from './components/MindShaperView';
import { AcademicEvolutionRPGView } from './components/AcademicEvolutionRPGView';
import { ExamModal } from './components/ExamModal';
import { FlashcardModal } from './components/FlashcardModal';
import { PDFUploadModal } from './components/PDFUploadModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import { LevelUpModal } from './components/LevelUpModal';
import { fireLevelUpCelebration, fireConfetti } from './lib/confetti';
import { soundEffects } from './lib/audio';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  syncUserProfile, 
  db, 
  saveExamResultToFirestore,
  StudentProgressData 
} from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulados');
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [exams, setExams] = useState<Exam[]>(sampleExams);
  const [flashcards, setFlashcards] = useState(sampleFlashcards);
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>(sampleMnemonics);

  // Modals & Settings state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isPDFUploadOpen, setIsPDFUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedMnemonic, setSelectedMnemonic] = useState<Mnemonic | null>(null);
  const [levelUpModalData, setLevelUpModalData] = useState<{
    rankName: string;
    xpEarned: number;
    totalXp: number;
    maxXp: number;
    title?: string;
    subtitle?: string;
  } | null>(null);

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Firebase Auth & Real-Time Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFbUser(currentUser);
        showToast(`⚡ Bem-vindo, ${currentUser.displayName || 'Estudante'}! Conectado com Google.`);
        
        // Sync & get Firestore document
        const firestoreProfile = await syncUserProfile(currentUser);
        
        // Listen to Firestore real-time profile updates
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubDoc = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as StudentProgressData;
            setUser((prev) => ({
              ...prev,
              uid: data.uid,
              email: data.email,
              googleConnected: true,
              name: data.displayName || currentUser.displayName || prev.name,
              rank: data.levelName || prev.rank,
              xp: data.xp,
              maxXp: data.maxXp,
              streakDays: data.streakDays,
              totalQuestionsAnswered: data.totalQuestionsAnswered,
              correctQuestionsCount: data.correctQuestionsCount,
              completedMinutesToday: data.completedMinutesToday,
              dailyGoalMinutes: data.dailyGoalMinutes,
              avatarUrl: data.photoURL || currentUser.photoURL || prev.avatarUrl,
              bankMastery: data.bankMastery || prev.bankMastery,
              cognitiveProfile: data.cognitiveProfile || prev.cognitiveProfile,
            }));
          }
        });

        return () => unsubDoc();
      } else {
        setFbUser(null);
        setUser((prev) => ({
          ...prev,
          googleConnected: false,
        }));
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Falha ao entrar com Google:', err);
      showToast('⚠️ Não foi possível autenticar com o Google. Tente novamente.');
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logoutUser();
      setUser(initialUserProfile);
      showToast('Desconectado com sucesso.');
    } catch (err) {
      console.error('Falha ao deslogar:', err);
    }
  };

  const triggerManualLevelUpCelebration = () => {
    fireLevelUpCelebration();
    setLevelUpModalData({
      rankName: user.rank,
      xpEarned: 350,
      totalXp: user.xp + 350,
      maxXp: user.maxXp,
      title: "Novo Nível Mental Alcançado!",
      subtitle: "Sua taxa de retenção de conteúdos jurídicos e raciocínio lógico aumentou em 22%."
    });
  };

  const handleFinishExam = async (score: number, total: number, xpEarned: number) => {
    const examBank = activeExam?.bank || 'Cebraspe (CESPE)';
    const examTitle = activeExam?.title || 'Simulado Geral';

    // Calculate level progression
    const newXp = user.xp + xpEarned;
    const isLeveledUp = newXp >= user.maxXp;
    const newRank = isLeveledUp ? 'Oficial de Elite (Sargento)' : user.rank;
    const newMaxXp = isLeveledUp ? user.maxXp + 2500 : user.maxXp;

    // Play synthesized auditory feedback
    if (isLeveledUp) {
      soundEffects.playLevelUpSound();
    } else {
      soundEffects.playTaskCompleteSound();
    }

    // Trigger celebration modal!
    setLevelUpModalData({
      rankName: newRank,
      xpEarned,
      totalXp: newXp,
      maxXp: newMaxXp,
      title: isLeveledUp ? "🎉 VOCÊ SUBIU DE POSTO!" : "Simulado Concluído com Sucesso!",
      subtitle: isLeveledUp 
        ? `Parabéns! Você alcançou a patente de ${newRank}. O algoritmo da banca foi desvendado.`
        : `Você acertou ${score} de ${total} questões e acumulou mais experiência.`
    });

    // If logged in to Google, save to Firestore
    if (fbUser) {
      await saveExamResultToFirestore(fbUser.uid, examTitle, examBank, score, total, xpEarned);
      showToast(`🏆 Resultado salvo no Firestore! +${xpEarned} XP conquistados.`);
    } else {
      // Local fallback
      setUser((prev) => ({
        ...prev,
        xp: newXp,
        rank: newRank,
        maxXp: newMaxXp,
        completedMinutesToday: Math.min(prev.dailyGoalMinutes, prev.completedMinutesToday + 15),
      }));
    }
  };

  const handleAwardXp = (xpEarned: number, reason: string) => {
    const newXp = user.xp + xpEarned;
    const isLeveledUp = newXp >= user.maxXp;
    const newRank = isLeveledUp ? 'Oficial de Elite (Sargento)' : user.rank;
    const newMaxXp = isLeveledUp ? user.maxXp + 2500 : user.maxXp;

    if (isLeveledUp) {
      fireLevelUpCelebration();
      soundEffects.playLevelUpSound();
      setLevelUpModalData({
        rankName: newRank,
        xpEarned,
        totalXp: newXp,
        maxXp: newMaxXp,
        title: "🎉 VOCÊ SUBIU DE NÍVEL!",
        subtitle: `Com o foco do Pomodoro, você alcançou a patente de ${newRank}.`
      });
    } else {
      soundEffects.playTaskCompleteSound();
    }

    setUser((prev) => ({
      ...prev,
      xp: newXp,
      rank: newRank,
      maxXp: newMaxXp,
      completedMinutesToday: Math.min(prev.dailyGoalMinutes, prev.completedMinutesToday + 25),
    }));

    showToast(`⚡ +${xpEarned} XP conquistados: ${reason}!`);
  };

  const handleFinishFlashcards = (count: number, xpEarned: number) => {
    const newXp = user.xp + xpEarned;

    // Play subtle audio task completion sound
    soundEffects.playTaskCompleteSound();

    setUser((prev) => ({
      ...prev,
      xp: newXp,
      completedMinutesToday: Math.min(prev.dailyGoalMinutes, prev.completedMinutesToday + 10),
    }));
    showToast(`Sessão de Flashcards concluída! +${xpEarned} XP e ciclo de repetição atualizado!`);
    setIsFlashcardOpen(false);
  };

  const handlePDFAnalysisComplete = (data: any) => {
    showToast('PDF analisado com sucesso pela IA! Novos flashcards foram gerados.');
    if (data.flashcards && Array.isArray(data.flashcards)) {
      const newCards = data.flashcards.map((fc: any, i: number) => ({
        id: `pdf-fc-${Date.now()}-${i}`,
        deckName: 'Importação PDF - Pontos do Edital',
        front: fc.front,
        back: fc.back,
        masteryLevel: 50,
      }));
      setFlashcards((prev) => [...newCards, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-[#0b1c30] flex flex-col font-body-md antialiased selection:bg-[#22c55e]/20 selection:text-[#004b1e]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#0b1c30] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-[#22c55e]/50 text-xs md:text-sm font-bold flex items-center gap-2.5 animate-fadeIn">
          <span className="text-base text-[#22c55e]">🔥</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Top Header */}
      <Header
        user={user}
        onOpenPDFUpload={() => setIsPDFUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoginGoogle={handleGoogleLogin}
      />

      {/* Main Tab Content View */}
      <main className={`flex-1 transition-all duration-500 ${
        isFocusMode && (activeTab === 'simulados' || activeTab === 'fixacao')
          ? 'grayscale-[85%] contrast-110 saturate-[0.25] brightness-95'
          : ''
      }`}>
        {isFocusMode && (activeTab === 'simulados' || activeTab === 'fixacao') && (
          <div className="bg-slate-900 text-amber-300 py-2 px-4 text-center text-xs font-mono border-b border-amber-500/30 flex items-center justify-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-sm">center_focus_strong</span>
            <span>MODO FOCO ATIVO • Distrações visuais reduzidas e filtro dessaturado aplicado para concentração extrema</span>
            <button
              onClick={() => setIsFocusMode(false)}
              className="ml-3 underline hover:text-white cursor-pointer font-bold"
            >
              Desativar
            </button>
          </div>
        )}

        {activeTab === 'simulados' && (
          <CentralSimuladosView
            exams={exams}
            user={user}
            onStartExam={(exam) => setActiveExam(exam)}
            onOpenAnalysis={() => setActiveTab('mente')}
            onStartQuickExam={() => setActiveExam(exams[0])}
          />
        )}

        {activeTab === 'fixacao' && (
          <MemorizacaoView
            flashcards={flashcards}
            mnemonics={mnemonics}
            onStartFlashcards={() => setIsFlashcardOpen(true)}
            onSelectMnemonic={(mn) => setSelectedMnemonic(mn)}
            onSendAICommand={(cmd) => {
              setActiveTab('tutor');
            }}
          />
        )}

        {activeTab === 'tutor' && (
          <IATutorChatView
            user={user}
            onStartMnemonicCreator={() => {
              setSelectedMnemonic(mnemonics[0]);
            }}
            onOpenOriginalQuestion={() => {
              setActiveExam(exams[0]);
            }}
          />
        )}

        {activeTab === 'mente' && (
          <MindShaperView
            user={user}
            onLoginGoogle={handleGoogleLogin}
            onAwardXp={handleAwardXp}
            onStartTargetedTraining={(bankName) => {
              const matched = exams.find((e) => e.bank.toLowerCase().includes(bankName.toLowerCase())) || exams[0];
              setActiveExam(matched);
            }}
          />
        )}

        {activeTab === 'rpg' && (
          <AcademicEvolutionRPGView userName={user.name} />
        )}

        {activeTab === 'painel' && (
          <PainelConcurseiroView
            user={user}
            exams={exams}
            onStartExam={(exam) => setActiveExam(exam)}
            onStartFlashcards={() => setIsFlashcardOpen(true)}
            onOpenPDFUpload={() => setIsPDFUploadOpen(true)}
            onOpenRanking={() => {
              showToast('Você está no Top 5% dos candidatos de Carreiras Policiais & Prefeituras!');
            }}
            onTriggerCelebration={triggerManualLevelUpCelebration}
          />
        )}
      </main>

      {/* Level Up Celebration Modal Overlay */}
      {levelUpModalData && (
        <LevelUpModal
          rankName={levelUpModalData.rankName}
          xpEarned={levelUpModalData.xpEarned}
          totalXp={levelUpModalData.totalXp}
          maxXp={levelUpModalData.maxXp}
          title={levelUpModalData.title}
          subtitle={levelUpModalData.subtitle}
          onClose={() => setLevelUpModalData(null)}
        />
      )}

      {/* Navigation Bottom Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals & Overlays */}
      {activeExam && (
        <ExamModal
          exam={activeExam}
          onClose={() => setActiveExam(null)}
          onFinishExam={handleFinishExam}
        />
      )}

      {isFlashcardOpen && (
        <FlashcardModal
          cards={flashcards}
          onClose={() => setIsFlashcardOpen(false)}
          onFinishSession={handleFinishFlashcards}
        />
      )}

      {isPDFUploadOpen && (
        <PDFUploadModal
          onClose={() => setIsPDFUploadOpen(false)}
          onAnalysisComplete={handlePDFAnalysisComplete}
        />
      )}

      {isSettingsOpen && (
        <SettingsDrawer
          user={user}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateGoal={(newGoal) => {
            setUser((prev) => ({ ...prev, dailyGoalMinutes: newGoal }));
            showToast(`Meta diária alterada para ${newGoal} minutos!`);
          }}
          onLoginGoogle={handleGoogleLogin}
          onLogoutGoogle={handleGoogleLogout}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => {
            setIsFocusMode((prev) => !prev);
            showToast(!isFocusMode ? '🎯 Modo Foco ativado! Escala de cinza e distrações reduzidas.' : 'Modo Foco desativado.');
          }}
        />
      )}

      {/* Mnemonic Details Modal */}
      {selectedMnemonic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 md:p-8 space-y-5 shadow-2xl border border-[#e5eeff]">
            <div className="flex justify-between items-center border-b border-[#e5eeff] pb-3">
              <span className="text-[10px] font-bold text-[#006e2f] uppercase tracking-widest block">
                MACETE DE FIXAÇÃO
              </span>
              <button
                onClick={() => setSelectedMnemonic(null)}
                className="w-8 h-8 rounded-full bg-[#e5eeff] text-[#545f73] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3 py-2">
              <h3 className="font-headline-md text-xl font-bold text-[#0b1c30]">
                {selectedMnemonic.title}
              </h3>
              <div className="inline-block p-4 bg-[#6d3bd7]/10 text-[#6d3bd7] font-extrabold text-2xl rounded-2xl border border-[#6d3bd7]/20 tracking-wider">
                {selectedMnemonic.acronym}
              </div>
              <p className="text-xs md:text-sm text-[#0b1c30] font-semibold leading-relaxed">
                {selectedMnemonic.meaning}
              </p>
              <p className="text-[11px] text-[#545f73]">Matéria: {selectedMnemonic.subject}</p>
            </div>

            <button
              onClick={() => setSelectedMnemonic(null)}
              className="w-full py-3 bg-[#006e2f] text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Compreendi e Memorizei
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
