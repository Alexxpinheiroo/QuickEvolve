import React from 'react';
import { Exam, UserProfile } from '../types';
import { BadgesGallerySection } from './BadgesGallerySection';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface PainelConcurseiroViewProps {
  user: UserProfile;
  exams: Exam[];
  onStartExam: (exam: Exam) => void;
  onStartFlashcards: () => void;
  onOpenPDFUpload: () => void;
  onOpenRanking: () => void;
  onTriggerCelebration?: () => void;
}

export const PainelConcurseiroView: React.FC<PainelConcurseiroViewProps> = ({
  user,
  exams,
  onStartExam,
  onStartFlashcards,
  onOpenPDFUpload,
  onOpenRanking,
  onTriggerCelebration,
}) => {
  const featuredExam = exams[0];

  // Weekly XP progression historical data for Recharts LineChart
  const weeklyXpData = [
    { day: 'Seg', xp: 280, questoes: 14, meta: 350 },
    { day: 'Ter', xp: 420, questoes: 22, meta: 350 },
    { day: 'Qua', xp: 390, questoes: 18, meta: 350 },
    { day: 'Qui', xp: 650, questoes: 30, meta: 350 },
    { day: 'Sex', xp: 520, questoes: 24, meta: 350 },
    { day: 'Sáb', xp: 880, questoes: 38, meta: 350 },
    { day: 'Dom', xp: Math.max(300, (user.xp % 1000) + 250), questoes: (user.totalQuestionsAnswered % 25) + 12, meta: 350 },
  ];

  return (
    <div className="pt-20 pb-28 px-4 md:px-12 max-w-[1280px] mx-auto animate-fadeIn space-y-12">
      {/* Dashboard Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats Bento Box */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goal Card */}
          <div className="bg-[#0f172a] p-7 rounded-[32px] border border-amber-500/20 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-1 block">
                    BATALHA DIÁRIA SPARTA
                  </span>
                  <h3 className="font-sparta text-2xl font-black text-slate-100">Meta do Guerreiro</h3>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-2xl fill-1">military_tech</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
                Faltam apenas <span className="font-bold text-amber-300">15 minutos</span> de estudo focado para cumprir o dever do dia.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-2xl md:text-3xl font-black text-slate-100 font-mono">
                  {user.completedMinutesToday}
                  <span className="text-sm font-medium text-slate-400">/{user.dailyGoalMinutes} min</span>
                </span>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold">
                  {Math.round((user.completedMinutesToday / user.dailyGoalMinutes) * 100)}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-red-600 rounded-full shadow-[0_0_12px_#f59e0b] relative overflow-hidden transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, (user.completedMinutesToday / user.dailyGoalMinutes) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#070a12] p-7 rounded-[32px] flex flex-col justify-between border border-amber-500/20 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-5 text-amber-400 shadow-md">
                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
              </div>
              <h3 className="font-sparta text-2xl font-black text-slate-100 mb-2">Análise de Editais PDF</h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Anexe PDFs de editais ou provas. Nossa Inteligência Spartan processará o conteúdo para traçar seu plano de batalha.
              </p>
            </div>

            <button
              onClick={onOpenPDFUpload}
              className="mt-6 w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">attach_file</span>
              Importar Edital Spartan
            </button>
          </div>
        </div>

        {/* Career Insight & Level Progress Card */}
        <div className="lg:col-span-4">
          <div className="h-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b]/40 to-[#070a12] p-7 rounded-[32px] border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between text-center space-y-6">
            <div className="relative z-10 space-y-3">
              <div className="w-16 h-16 bg-gradient-to-tr from-red-800 to-amber-500 rounded-full flex items-center justify-center mx-auto border-2 border-amber-400/50 shadow-xl">
                <span className="material-symbols-outlined text-3xl text-white fill-1">military_tech</span>
              </div>
              <div>
                <span className="px-3 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-1">
                  PATENTE DE ELITE
                </span>
                <h4 className="font-sparta text-2xl font-black text-amber-300">{user.rank}</h4>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Você está no <span className="text-amber-400 font-bold">Top {user.rankTopPercentile}%</span> da Legião de Concurseiros Spartan.
              </p>

              {/* XP Progress Bar */}
              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5 text-left">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <span>Nível XP</span>
                  <span className="text-amber-300 font-mono">{user.xp} / {user.maxXp} XP</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-700 shadow-[0_0_8px_#f59e0b]" 
                    style={{ width: `${Math.min(100, (user.xp / user.maxXp) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              {onTriggerCelebration && (
                <button
                  onClick={onTriggerCelebration}
                  className="w-full py-3 bg-gradient-to-r from-red-800 to-amber-600 text-white hover:brightness-110 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-1.5 border border-amber-500/30"
                >
                  <span className="material-symbols-outlined text-base">celebration</span>
                  Celebrar Subida de Nível 🎉
                </button>
              )}

              <button
                onClick={onOpenRanking}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Legião & Ranking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sparta text-xl md:text-2xl font-black text-slate-100 flex items-center gap-2.5">
            Continuar Batalha
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Simulated Exam Card */}
          <div className="bg-[#0f172a] p-6 rounded-[28px] border border-amber-500/20 shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/30">
                  <span className="material-symbols-outlined text-xl">shield</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  PC-RS / PENAL
                </span>
              </div>
              <h3 className="font-sparta text-lg font-bold text-slate-100 mb-2">{featuredExam.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Foco em <span className="text-amber-300 font-semibold">Legislação Especial</span> e{' '}
                <span className="text-amber-300 font-semibold">Português</span>. 35/80 questões vencidas.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] flex items-center justify-center">
                  43%
                </div>
                <span className="text-xs text-slate-400 font-medium">Concluído</span>
              </div>
              <button
                onClick={() => onStartExam(featuredExam)}
                className="flex items-center gap-1.5 text-amber-400 font-bold text-xs hover:underline cursor-pointer"
              >
                Retomar <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* AI Revision Card */}
          <div className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b]/30 to-[#070a12] p-6 rounded-[28px] border border-red-500/30 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                  <span className="material-symbols-outlined text-base fill-1">auto_awesome</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">MENTOR SPARTA</span>
              </div>
              <h3 className="font-sparta text-lg font-bold text-slate-100 mb-2">Revisão: Direito Penal</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Personalizado com base nas suas falhas recentes em <span className="font-semibold text-amber-300">Canoas - 2024</span>.
              </p>
            </div>

            <button
              onClick={onStartFlashcards}
              className="w-full py-3.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg border border-red-500/40 transition-all cursor-pointer"
            >
              Iniciar Flashcards
            </button>
          </div>

          {/* Quick Action Card */}
          <div
            onClick={() => onStartExam(featuredExam)}
            className="bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-amber-500/50 p-6 rounded-[28px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/80 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">add_task</span>
            </div>
            <h4 className="font-sparta font-bold text-slate-100 text-base mb-1">Novo Simulado</h4>
            <p className="text-xs text-slate-400">Gere um teste sparta agora</p>
          </div>
        </div>
      </section>

      {/* Recharts Weekly XP Historical Progression Line Chart */}
      <section className="bg-[#0f172a] rounded-[32px] p-6 md:p-8 border border-amber-500/20 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-widest">
                HISTÓRICO SEMANAL SPARTA
              </span>
              <span className="text-xs font-bold text-slate-400">• Tendência de Aprendizado</span>
            </div>
            <h2 className="font-sparta text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
              Evolução Diária de Experiência
              <span className="material-symbols-outlined text-amber-400 fill-1">trending_up</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">XP Atual</span>
              <span className="text-lg font-black text-amber-300 font-mono">{user.xp} XP</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md">
              ⚡
            </div>
          </div>
        </div>

        {/* Recharts Line Chart Container */}
        <div className="h-[290px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyXpData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#0b0f19] text-white p-3.5 rounded-2xl shadow-xl border border-amber-500/30 text-xs space-y-1.5">
                        <p className="font-extrabold text-amber-400 font-sparta">{label}-feira</p>
                        <p className="font-semibold text-white">
                          ⚡ <span className="text-amber-300 font-black">{payload[0].value} XP</span> obtidos
                        </p>
                        {payload[1] && (
                          <p className="text-slate-400 text-[11px]">
                            🎯 Meta diária: <span className="text-slate-200 font-mono">{payload[1].value} XP</span>
                          </p>
                        )}
                        <p className="text-slate-300 text-[11px] pt-1 border-t border-slate-800">
                          📝 {payload[0].payload.questoes} questões vencidas
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
                formatter={(value) => (
                  <span className="text-slate-300 font-bold text-xs">{value === 'xp' ? 'XP Diário Conquistado' : 'Meta Mínima Diária'}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="xp"
                name="xp"
                stroke="#f59e0b"
                strokeWidth={3.5}
                dot={{ r: 6, fill: '#fbbf24', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="meta"
                name="meta"
                stroke="#475569"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Badges and Medals Gallery Section */}
      <BadgesGallerySection user={user} />

      {/* Evolutionary Insights */}
      <section className="bg-[#0f172a] rounded-[32px] p-8 border border-amber-500/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-sparta text-xl font-bold text-slate-100">Indicadores do Guerreiro</h2>
          <span className="material-symbols-outlined text-amber-400 fill-1 text-xl">trending_up</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-3 block">
              PONTOS FORTES
            </span>
            <div className="flex flex-wrap gap-2">
              {user.strongSubjects.map((sub) => (
                <span
                  key={sub}
                  className="px-3.5 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 mb-3 block">
              ALVO DE TREINO
            </span>
            <div className="flex flex-wrap gap-2">
              {user.weakSubjects.map((sub) => (
                <span
                  key={sub}
                  className="px-3.5 py-1.5 bg-red-950/60 text-red-300 border border-red-800/60 rounded-xl text-xs font-bold"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3 block">
              TEMPO EM COMBATE
            </span>
            <div className="text-3xl font-black text-slate-100 font-mono">
              {user.totalStudyHours}<span className="text-lg font-medium text-slate-400">h</span>{' '}
              {user.totalStudyMinutes}<span className="text-lg font-medium text-slate-400">m</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Dedicação exclusiva à aprovação</p>
          </div>
        </div>
      </section>
    </div>
  );
};
