import React, { useEffect } from 'react';
import { fireLevelUpCelebration } from '../lib/confetti';

interface LevelUpModalProps {
  rankName: string;
  xpEarned: number;
  totalXp: number;
  maxXp: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  rankName,
  xpEarned,
  totalXp,
  maxXp,
  title = "Sua Mente Evoluiu!",
  subtitle = "Parabéns! Seu cérebro concluiu a assimilação de padrões da banca com sucesso.",
  onClose
}) => {
  useEffect(() => {
    // Fire confetti bursts as soon as the modal mounts
    fireLevelUpCelebration();
  }, []);

  const progressPercent = Math.min(100, Math.round((totalXp / maxXp) * 100));

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-[#0f243a] via-[#0b1c30] to-[#081321] text-white rounded-[36px] w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl border border-slate-700/80 relative overflow-hidden text-center">
        
        {/* Glow ambient background circles */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#22c55e]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Trophy / Badge Icon */}
        <div className="relative z-10 flex flex-col items-center pt-2">
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-[#22c55e] via-[#10b981] to-[#3b82f6] p-1 shadow-xl flex items-center justify-center animate-bounce">
              <div className="w-full h-full bg-[#0b1c30] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl md:text-6xl text-[#22c55e]">
                  workspace_premium
                </span>
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 bg-amber-400 text-[#0b1c30] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border-2 border-[#0b1c30]">
              +1 Nível
            </span>
          </div>

          <div className="mt-5 space-y-1">
            <span className="px-3.5 py-1 bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 rounded-full text-[11px] font-extrabold uppercase tracking-widest inline-block">
              🎉 NOVO POSTO CONQUISTADO
            </span>
            <h2 className="font-headline-xl text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Rank Badge Card */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/15 space-y-3 relative z-10">
          <div className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
            Patente / Rank Concurseiro
          </div>
          <div className="font-headline-md text-xl md:text-2xl font-black text-[#22c55e] tracking-tight">
            {rankName}
          </div>

          {/* XP Reward breakdown */}
          <div className="flex justify-between items-center bg-black/30 px-4 py-2.5 rounded-xl border border-white/10 text-xs">
            <span className="text-slate-300 font-medium">Recompensa da Sessão:</span>
            <span className="font-extrabold text-amber-300 text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-base">bolt</span>
              +{xpEarned} XP
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1 text-left">
            <div className="flex justify-between text-[11px] font-bold text-slate-300">
              <span>Progresso de Experiência</span>
              <span>{totalXp} / {maxXp} XP ({progressPercent}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-[#22c55e] via-emerald-400 to-blue-500 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Motivational Cognitive Tip */}
        <div className="p-3.5 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl text-left flex items-start gap-3 text-xs text-slate-200">
          <span className="material-symbols-outlined text-xl text-[#22c55e] flex-shrink-0">
            auto_awesome
          </span>
          <div>
            <strong className="text-white block font-bold mb-0.5">Reforço de Dopamina Positiva:</strong>
            Estudos mostram que celebrar pequenas vitórias consolida o aprendizado de longo prazo na memória de trabalho.
          </div>
        </div>

        {/* Confirm Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-[#002109] font-black text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95 relative z-10"
        >
          Continuar Moldando a Mente 🚀
        </button>
      </div>
    </div>
  );
};
