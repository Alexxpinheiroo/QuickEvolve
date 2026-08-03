import React, { useState } from 'react';
import { Exam, UserProfile } from '../types';

interface CentralSimuladosViewProps {
  exams: Exam[];
  user: UserProfile;
  onStartExam: (exam: Exam) => void;
  onOpenAnalysis: () => void;
  onStartQuickExam: () => void;
}

export const CentralSimuladosView: React.FC<CentralSimuladosViewProps> = ({
  exams,
  user,
  onStartExam,
  onOpenAnalysis,
  onStartQuickExam,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Policiais');

  const filteredExams = exams.filter((exam) => {
    if (selectedCategory === 'Policiais') return exam.category === 'Policiais';
    if (selectedCategory === 'Administrativo') return exam.category === 'Administrativo';
    if (selectedCategory === 'Legislação') return exam.category === 'Legislação' || exam.category === 'Geral';
    return true;
  });

  const featuredExam = exams.find((e) => e.id === 'policia-penal-rs-2024') || exams[0];

  return (
    <div className="pt-20 pb-28 px-4 md:px-12 max-w-[1280px] mx-auto animate-fadeIn">
      {/* Header Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006e2f]/10 text-[#006e2f] mb-3">
              <span className="material-symbols-outlined text-sm fill-1">star</span>
              <span className="font-semibold text-[11px] uppercase tracking-wider">PREMIUM DASHBOARD</span>
            </div>
            <h2 className="font-headline-xl text-3xl md:text-5xl font-extrabold text-[#0b1c30] mb-3 tracking-tight">
              Central de Simulados
            </h2>
            <p className="font-body-lg text-base md:text-lg text-[#545f73] leading-relaxed">
              Foco em Carreiras Policiais e Municipais. O catálogo mais completo para Polícia Penal RS e prefeituras do sul.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-[#e5eeff] p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {['Policiais', 'Administrativo', 'Legislação'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white shadow-sm text-[#006e2f] border border-[#006e2f]/10'
                    : 'text-[#545f73] hover:text-[#0b1c30] hover:bg-white/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Card */}
        <div className="md:col-span-8 featured-card rounded-[36px] p-8 md:p-11 relative overflow-hidden flex flex-col justify-between min-h-[420px] group shadow-xl">
          {/* Decorative background policy shield icon */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <span className="material-symbols-outlined text-[380px] absolute -right-16 -top-16 text-white font-thin">
              policy
            </span>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full mb-6 border border-white/10">
              <span className="material-symbols-outlined text-[18px] fill-1">auto_awesome</span>
              <span className="text-[11px] font-bold uppercase tracking-widest">
                {featuredExam.badge || 'RECOMENDADO PARA VOCÊ'}
              </span>
            </div>

            <h3 className="font-headline-xl text-white text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              {featuredExam.title} <br />
              <span className="opacity-80 font-light text-2xl md:text-4xl">{featuredExam.subtitle}</span>
            </h3>

            <p className="text-white/85 font-body-lg text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              {featuredExam.description}
            </p>

            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white/60">menu_book</span>
                <span className="text-xs font-bold uppercase tracking-wider">{featuredExam.questionCount} QUESTÕES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white/60">verified</span>
                <span className="text-xs font-bold uppercase tracking-wider">{featuredExam.level}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <button
              onClick={() => onStartExam(featuredExam)}
              className="bg-white text-[#6d3bd7] px-8 py-4 rounded-2xl font-bold text-sm md:text-base flex items-center gap-3 active:scale-95 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer"
            >
              INICIAR AGORA
              <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
            </button>
          </div>
        </div>

        {/* Refined Stats Card */}
        <div className="md:col-span-4 bg-white premium-shadow rounded-[36px] p-8 md:p-9 flex flex-col justify-between border border-[#e5eeff]">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[#545f73] uppercase tracking-widest text-[11px] font-bold mb-1">SEU PROGRESSO</p>
                <h4 className="font-headline-md text-2xl font-bold text-[#0b1c30]">Desempenho Geral</h4>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/15 flex items-center justify-center text-[#006e2f]">
                <span className="material-symbols-outlined text-3xl fill-1">military_tech</span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#eff4ff] border border-[#e5eeff]">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#006e2f] text-sm">{user.rank}</span>
                    <span className="text-[#545f73] text-xs">Próximo: {user.nextRank}</span>
                  </div>
                  <span className="text-sm font-bold text-[#0b1c30]">
                    {user.xp.toLocaleString()} / {(user.maxXp / 1000).toFixed(0)}k <span className="text-[#545f73] font-normal">XP</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-[#006e2f] rounded-full relative overflow-hidden transition-all duration-1000"
                    style={{ width: `${Math.min(100, (user.xp / user.maxXp) * 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#6d3bd7]/20 flex items-center justify-center text-[#6d3bd7] text-[10px] font-extrabold">
                    PT
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#006e2f]/20 flex items-center justify-center text-[#006e2f] text-[10px] font-extrabold">
                    DP
                  </div>
                </div>
                <p className="text-xs text-[#545f73]">
                  Você é destaque em <span className="text-[#0b1c30] font-semibold">{user.highlightSubject}</span> ({user.highlightAccuracy}%)
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAnalysis}
            className="w-full mt-8 py-4 bg-[#0b1c30] hover:bg-[#006e2f] text-white transition-colors rounded-2xl font-bold text-xs uppercase tracking-widest cursor-pointer shadow-md"
          >
            ANÁLISE DETALHADA
          </button>
        </div>

        {/* Subject Cards Grid */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-[28px] p-6 flex flex-col justify-between border border-[#e5eeff] hover:border-[#22c55e]/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#e5eeff] flex items-center justify-center text-[#545f73] group-hover:bg-[#22c55e]/20 group-hover:text-[#006e2f] transition-colors">
                    <span className="material-symbols-outlined text-2xl">{exam.icon}</span>
                  </div>
                  <span className="bg-[#e5eeff] text-[#545f73] px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-extrabold">
                    {exam.badge || exam.category}
                  </span>
                </div>

                <h5 className="font-headline-md text-lg font-bold text-[#0b1c30] mb-2 group-hover:text-[#006e2f] transition-colors">
                  {exam.title}
                </h5>
                <p className="text-xs text-[#545f73] mb-6 leading-relaxed line-clamp-2">
                  {exam.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#e5eeff]">
                <div className="flex items-center gap-1.5 text-[#545f73]">
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  <span className="text-[11px] font-bold">{exam.questionCount} QUESTÕES</span>
                </div>
                <button
                  onClick={() => onStartExam(exam)}
                  className="w-10 h-10 rounded-xl bg-[#e5eeff] flex items-center justify-center text-[#006e2f] group-hover:bg-[#006e2f] group-hover:text-white transition-all cursor-pointer shadow-sm"
                  title="Iniciar Questões"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button for Quick Exam */}
      <button
        onClick={onStartQuickExam}
        className="fixed bottom-20 md:bottom-10 right-5 md:right-10 bg-[#006e2f] hover:bg-[#005321] text-white flex items-center gap-2.5 px-6 py-4 rounded-3xl shadow-2xl active:scale-95 hover:scale-105 transition-all z-40 cursor-pointer border border-white/20"
      >
        <span className="material-symbols-outlined text-[22px] text-[#6bff8f]">flash_on</span>
        <span className="font-bold text-xs md:text-sm whitespace-nowrap tracking-wider uppercase">
          Simulado Rápido (10q)
        </span>
      </button>
    </div>
  );
};
