import React, { useState, useEffect, useRef } from 'react';
import { fireConfetti } from '../lib/confetti';

interface PomodoroTimerProps {
  onAwardXp?: (xp: number, reason: string) => void;
  onOpenTargetedTraining?: () => void;
}

type PomodoroMode = 'foco_25' | 'maratona_50' | 'pausa_5' | 'pausa_15';

interface ModeConfig {
  id: PomodoroMode;
  label: string;
  minutes: number;
  xpReward: number;
  color: string;
  badgeText: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'foco_25',
    label: 'Foco Concurseiro',
    minutes: 25,
    xpReward: 200,
    color: 'from-[#22c55e] to-emerald-600',
    badgeText: '25 min • +200 XP',
  },
  {
    id: 'maratona_50',
    label: 'Maratona de Questões',
    minutes: 50,
    xpReward: 450,
    color: 'from-amber-500 to-orange-600',
    badgeText: '50 min • +450 XP',
  },
  {
    id: 'pausa_5',
    label: 'Pausa Curta',
    minutes: 5,
    xpReward: 50,
    color: 'from-blue-500 to-indigo-600',
    badgeText: '5 min • +50 XP',
  },
  {
    id: 'pausa_15',
    label: 'Pausa Longa',
    minutes: 15,
    xpReward: 100,
    color: 'from-purple-500 to-violet-600',
    badgeText: '15 min • +100 XP',
  },
];

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onAwardXp,
  onOpenTargetedTraining,
}) => {
  const [activeMode, setActiveMode] = useState<PomodoroMode>('foco_25');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  
  // Modal state when timer finishes
  const [finishedModalData, setFinishedModalData] = useState<{
    modeLabel: string;
    xpEarned: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentModeConfig = MODES.find((m) => m.id === activeMode) || MODES[0];

  // Web Audio chime helper
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio fallback ignored if blocked by browser policy
    }
  };

  // Switch timer mode
  const handleSelectMode = (mode: PomodoroMode) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const cfg = MODES.find((m) => m.id === mode) || MODES[0];
    setActiveMode(mode);
    setSecondsLeft(cfg.minutes * 60);
    setTotalSeconds(cfg.minutes * 60);
  };

  // Timer Tick interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, activeMode]);

  const handleTimerComplete = () => {
    playChime();
    fireConfetti(100, 80);

    const cfg = currentModeConfig;
    if (onAwardXp) {
      onAwardXp(cfg.xpReward, `Cronômetro Pomodoro Spartan (${cfg.label})`);
    }

    setFinishedModalData({
      modeLabel: cfg.label,
      xpEarned: cfg.xpReward,
    });
  };

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(currentModeConfig.minutes * 60);
    setTotalSeconds(currentModeConfig.minutes * 60);
  };

  // Fast forward test mode (10 seconds)
  const handleTest10Sec = () => {
    setIsRunning(false);
    setTotalSeconds(10);
    setSecondsLeft(10);
    setIsRunning(true);
  };

  const addExtraMinute = () => {
    setSecondsLeft((prev) => prev + 60);
    setTotalSeconds((prev) => prev + 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)));

  return (
    <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-8 border border-amber-500/20 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-widest">
              CRONÔMETRO DE ELITE SPARTA 🛡️
            </span>
            <span className="text-xs font-bold text-slate-400">• Foco Inabalável</span>
          </div>
          <h2 className="font-sparta text-xl md:text-2xl font-black text-slate-100 flex items-center gap-2">
            Tempo de Combate & Foco
            <span className="material-symbols-outlined text-amber-400 fill-1">timer</span>
          </h2>
        </div>

        {/* Mode Chips Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl overflow-x-auto border border-slate-800">
          {MODES.map((cfg) => (
            <button
              key={cfg.id}
              onClick={() => handleSelectMode(cfg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                activeMode === cfg.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timer Display Section */}
      <div className="bg-gradient-to-br from-[#070a12] via-[#0f172a] to-[#070a12] p-8 rounded-[28px] text-white text-center space-y-6 relative overflow-hidden shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full text-xs font-extrabold border border-amber-500/30 inline-block">
            {currentModeConfig.badgeText}
          </span>

          {/* Big Digital Clock */}
          <div className="font-mono text-5xl md:text-7xl font-black tracking-widest text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)] my-2">
            {formatTime(secondsLeft)}
          </div>

          <p className="text-xs text-slate-400">
            {isRunning ? '⚔️ Foco absoluto Spartan! Concentração total no objetivo.' : 'Pressione iniciar para entrar em combate com as bancas.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 max-w-md mx-auto relative z-10">
          <div className="flex justify-between text-[11px] font-bold text-slate-300">
            <span>Progresso da Batalha</span>
            <span className="text-amber-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full bg-gradient-to-r from-amber-500 via-amber-400 to-red-600 rounded-full transition-all duration-300 shadow-[0_0_12px_#f59e0b]`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2 relative z-10 flex-wrap">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl active:scale-95 flex items-center gap-2 ${
              isRunning
                ? 'bg-red-700 hover:bg-red-600 text-white border border-red-500'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/30'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pausar Combate' : 'Iniciar Batalha'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all cursor-pointer border border-slate-700"
            title="Reiniciar Tempo"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
          </button>

          <button
            onClick={addExtraMinute}
            className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            title="Adicionar +1 minuto ao tempo"
          >
            +1 Min
          </button>

          {/* Quick 10-sec test button for easy verification */}
          <button
            onClick={handleTest10Sec}
            className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
            title="Testar finalização rápida em 10 segundos"
          >
            ⚡ Teste (10s)
          </button>
        </div>
      </div>

      {/* Completion Modal / Reward & Question Recording Reminder */}
      {finishedModalData && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f172a] rounded-[32px] w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-500/40 text-center relative overflow-hidden text-slate-100">
            
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-red-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl shadow-xl animate-bounce border border-amber-400/50">
              🛡️
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-extrabold uppercase tracking-widest inline-block">
                BATALHA CONCLUÍDA COM HONRA
              </span>
              <h3 className="font-sparta text-2xl font-black text-amber-300">
                Guerreiro Spartan Victorioso!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Você completou com sucesso a sessão <strong className="text-white">{finishedModalData.modeLabel}</strong>.
              </p>
            </div>

            {/* Recompensa de XP */}
            <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xl shadow-md">
                  ⚡
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">Recompensa de Combate</span>
                  <span className="text-sm font-extrabold text-amber-300">
                    +{finishedModalData.xpEarned} XP creditados ao seu Rank Spartan!
                  </span>
                </div>
              </div>
            </div>

            {/* Lembrete da IA para registrar questões */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">edit_note</span>
                Comando do Mentor Spartan:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                📝 <strong>A hora da prática é agora!</strong> Registre quantas questões você combateu e venceu nesta sessão para atualizar seus indicadores de domínio das bancas!
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {onOpenTargetedTraining && (
                <button
                  onClick={() => {
                    setFinishedModalData(null);
                    onOpenTargetedTraining();
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">assignment</span>
                  Registrar Questões Vencidas
                </button>
              )}

              <button
                onClick={() => setFinishedModalData(null)}
                className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all border border-slate-700"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
