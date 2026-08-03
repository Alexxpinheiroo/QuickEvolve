import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 sm:px-6 pb-4 pt-2.5 bg-[#0b0f19]/95 backdrop-blur-xl border-t border-amber-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      {/* Tab 1: Simulados */}
      <button
        onClick={() => setActiveTab('simulados')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all cursor-pointer relative ${
          activeTab === 'simulados' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'simulados' && (
          <span className="absolute -top-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
        )}
        <span className={`material-symbols-outlined text-2xl ${activeTab === 'simulados' ? 'fill-1' : ''}`}>
          quiz
        </span>
        <span className="text-[11px] mt-0.5 font-medium tracking-tight">Simulados</span>
      </button>

      {/* Tab 2: Fixação / Memorização */}
      <button
        onClick={() => setActiveTab('fixacao')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all cursor-pointer relative ${
          activeTab === 'fixacao' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'fixacao' && (
          <span className="absolute -top-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
        )}
        <span className={`material-symbols-outlined text-2xl ${activeTab === 'fixacao' ? 'fill-1' : ''}`}>
          psychology
        </span>
        <span className="text-[11px] mt-0.5 font-medium tracking-tight">Fixação</span>
      </button>

      {/* Tab 3: IA Tutor */}
      <button
        onClick={() => setActiveTab('tutor')}
        className={`flex flex-col items-center justify-center transition-all cursor-pointer relative ${
          activeTab === 'tutor'
            ? 'text-amber-400 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'tutor' && (
          <span className="absolute -top-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
        )}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeTab === 'tutor'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/30'
              : 'bg-slate-800 text-amber-400 border border-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-xl fill-1">auto_awesome</span>
        </div>
        <span className="text-[11px] mt-0.5 font-medium tracking-tight">IA Tutor</span>
      </button>

      {/* Tab 4: Moldagem Mente IA */}
      <button
        onClick={() => setActiveTab('mente')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all cursor-pointer relative ${
          activeTab === 'mente' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'mente' && (
          <span className="absolute -top-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
        )}
        <span className={`material-symbols-outlined text-2xl ${activeTab === 'mente' ? 'fill-1' : ''}`}>
          neurology
        </span>
        <span className="text-[11px] mt-0.5 font-medium tracking-tight">Mente IA</span>
      </button>

      {/* Tab 5: RPG Evolução Acadêmica */}
      <button
        onClick={() => setActiveTab('rpg')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all cursor-pointer relative ${
          activeTab === 'rpg' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'rpg' && (
          <span className="absolute -top-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
        )}
        <span className={`material-symbols-outlined text-2xl ${activeTab === 'rpg' ? 'fill-1' : ''}`}>
          military_tech
        </span>
        <span className="text-[11px] mt-0.5 font-medium tracking-tight">Evolução</span>
      </button>

      {/* Tab 6: Status / Painel */}
      <button
        onClick={() => setActiveTab('painel')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all cursor-pointer relative ${
          activeTab === 'painel' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {activeTab === 'painel' && (
          <span className="absolute -top-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
        )}
        <span className={`material-symbols-outlined text-2xl ${activeTab === 'painel' ? 'fill-1' : ''}`}>
          insights
        </span>
        <span className="text-[11px] mt-0.5 font-medium tracking-tight">Painel</span>
      </button>
    </nav>
  );
};
