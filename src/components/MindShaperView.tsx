import React from 'react';
import { UserProfile, BankMastery, CognitiveProfile } from '../types';
import { PomodoroTimer } from './PomodoroTimer';

interface MindShaperViewProps {
  user: UserProfile;
  onLoginGoogle: () => void;
  onStartTargetedTraining: (bankName: string) => void;
  onAwardXp?: (xp: number, reason: string) => void;
}

export const MindShaperView: React.FC<MindShaperViewProps> = ({
  user,
  onLoginGoogle,
  onStartTargetedTraining,
  onAwardXp,
}) => {
  const mastery: BankMastery = user.bankMastery || {
    cebraspe: 74,
    fgv: 68,
    ibfc: 82,
    fundatec: 89,
    vunesp: 81,
    laSalle: 85,
  };

  const cognitive: CognitiveProfile = user.cognitiveProfile || {
    trapResistance: 76,
    lawTextPrecision: 88,
    jurisprudenceMastery: 72,
    avgTimePerQuestionSec: 75,
    mindShapeStage: 'Mente Adaptativa Multibancas',
    cognitiveDiagnosis: 'Sua mente possui excelente retenção do texto seco da lei (estilo Fundatec/LaSalle). O foco atual da IA é refinar sua tomada de decisão no Cebraspe (C/E).',
  };

  return (
    <div className="pt-20 pb-28 px-4 md:px-12 max-w-[1280px] mx-auto animate-fadeIn space-y-10">
      {/* Top Banner: Google Sync & Mind Molding Status */}
      <div className="bg-gradient-to-r from-[#0b1c30] via-[#162a45] to-[#0b1c30] text-white p-6 md:p-8 rounded-[32px] border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                MOLDAGEM MENTAL COGNITIVA IA
              </span>
              
              {user.googleConnected ? (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">cloud_done</span>
                  Conta Google Sincronizada
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">cloud_off</span>
                  Modo Convidado
                </span>
              )}
            </div>

            <h2 className="font-headline-xl text-2xl md:text-3xl font-extrabold text-white">
              Modelagem Neural Concurseira
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              O QuickEvolve analisa suas respostas em simulados de <strong className="text-white">Prefeituras (Fundatec/La Salle)</strong> e <strong className="text-white">Carreiras Policiais (Cebraspe/FGV)</strong> para reconfigurar seus vieses de dúvida e ansiedade.
            </p>
          </div>

          {!user.googleConnected ? (
            <button
              onClick={onLoginGoogle}
              className="px-6 py-3.5 bg-white text-[#0b1c30] hover:bg-slate-100 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer shadow-lg active:scale-95 flex-shrink-0"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Entrar com Google para Salvar Evolução</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/20">
              <img src={user.avatarUrl} alt="Google Avatar" className="w-11 h-11 rounded-full border-2 border-[#22c55e]" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">{user.name}</span>
                <span className="text-[11px] text-[#22c55e] font-semibold">{user.email}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Pomodoro Timer Section */}
      <PomodoroTimer
        onAwardXp={onAwardXp}
        onOpenTargetedTraining={() => onStartTargetedTraining(mastery.cebraspe < mastery.fgv ? 'Cebraspe (CESPE)' : 'FGV')}
      />

      {/* Main Grid: Mind Shaping Radar + Bank Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cognitive Radar & Stage */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-7 rounded-[32px] border border-[#e5eeff] shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-[#e5eeff] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#006e2f] uppercase tracking-widest block mb-1">
                  ESTÁGIO ATUAL DO ALUNO
                </span>
                <h3 className="font-headline-md text-xl font-bold text-[#0b1c30]">
                  {cognitive.mindShapeStage}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#6d3bd7]/10 text-[#6d3bd7] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl fill-1">psychology</span>
              </div>
            </div>

            {/* Cognitive Diagnosis Card */}
            <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#d3e4fe] space-y-2">
              <div className="flex items-center gap-2 text-[#006e2f] font-bold text-xs uppercase">
                <span className="material-symbols-outlined text-base">neurology</span>
                Diagnóstico Comportamental IA:
              </div>
              <p className="text-xs text-[#0b1c30] leading-relaxed font-medium">
                "{cognitive.cognitiveDiagnosis}"
              </p>
            </div>

            {/* 4 Pillars Progress Bars */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#545f73]">
                Pilares da Moldagem Cognitiva
              </h4>

              {/* Pillar 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0b1c30]">Resistência a Pegadinhas (STF/STJ)</span>
                  <span className="text-[#006e2f]">{cognitive.trapResistance}%</span>
                </div>
                <div className="w-full h-3 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#22c55e] to-[#006e2f] rounded-full transition-all duration-700" 
                    style={{ width: `${cognitive.trapResistance}%` }} 
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0b1c30]">Memorização da Letra Seca da Lei (Prefeituras)</span>
                  <span className="text-[#006e2f]">{cognitive.lawTextPrecision}%</span>
                </div>
                <div className="w-full h-3 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-full transition-all duration-700" 
                    style={{ width: `${cognitive.lawTextPrecision}%` }} 
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#0b1c30]">Interpretação e Casos Práticos (FGV)</span>
                  <span className="text-[#6d3bd7]">{cognitive.jurisprudenceMastery}%</span>
                </div>
                <div className="w-full h-3 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#6d3bd7] rounded-full transition-all duration-700" 
                    style={{ width: `${cognitive.jurisprudenceMastery}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bank Mastery & Target Action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-7 rounded-[32px] border border-[#e5eeff] shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-[#e5eeff] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#006e2f] uppercase tracking-widest block mb-1">
                  DOMÍNIO COMPARATIVO DE BANCAS
                </span>
                <h3 className="font-headline-md text-xl font-bold text-[#0b1c30]">
                  Prefeituras x Carreiras Policiais
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#006e2f]/10 text-[#006e2f] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">analytics</span>
              </div>
            </div>

            {/* Bank Mastery Comparison Bars */}
            <div className="grid grid-cols-2 gap-4">
              {/* Fundatec */}
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="text-[#0b1c30]">Fundatec</span>
                  <span className="text-[#006e2f]">{mastery.fundatec}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006e2f] rounded-full" style={{ width: `${mastery.fundatec}%` }} />
                </div>
                <span className="text-[10px] text-[#545f73] block">Letra Seca / Prefeituras</span>
              </div>

              {/* Cebraspe */}
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="text-[#0b1c30]">Cebraspe (CESPE)</span>
                  <span className="text-[#006e2f]">{mastery.cebraspe}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: `${mastery.cebraspe}%` }} />
                </div>
                <span className="text-[10px] text-[#545f73] block">Certo/Errado & Punitivo</span>
              </div>

              {/* La Salle */}
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="text-[#0b1c30]">La Salle</span>
                  <span className="text-[#006e2f]">{mastery.laSalle}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006e2f] rounded-full" style={{ width: `${mastery.laSalle}%` }} />
                </div>
                <span className="text-[10px] text-[#545f73] block">Concursos Municipais</span>
              </div>

              {/* FGV */}
              <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-[#e5eeff] space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="text-[#0b1c30]">FGV</span>
                  <span className="text-[#6d3bd7]">{mastery.fgv}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6d3bd7] rounded-full" style={{ width: `${mastery.fgv}%` }} />
                </div>
                <span className="text-[10px] text-[#545f73] block">Casos Práticos Densos</span>
              </div>
            </div>

            {/* Targeted Training Trigger */}
            <div className="p-5 bg-gradient-to-br from-[#0b1c30] to-[#1e293b] rounded-2xl text-white space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#22c55e] block mb-1">
                  REFORÇO COGNITIVO RECOMENDADO DA IA
                </span>
                <h4 className="font-bold text-base">Sessão de Treino Moldagem FGV / Cebraspe</h4>
                <p className="text-xs text-slate-300">
                  Acelere sua adaptação para eliminar dúvidas nas pegadinhas da banca com menor rendimento.
                </p>
              </div>

              <button
                onClick={() => onStartTargetedTraining(mastery.cebraspe < mastery.fgv ? 'Cebraspe (CESPE)' : 'FGV')}
                className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] text-[#002109] font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Disparar Treino de Moldagem Neural
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
