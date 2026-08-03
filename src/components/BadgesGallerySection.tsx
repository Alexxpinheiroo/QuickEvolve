import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';
import { getBadgesWithUserProgress } from '../data/badgesData';
import { fireConfetti } from '../lib/confetti';

interface BadgesGallerySectionProps {
  user: UserProfile;
  onBadgeClick?: (badge: Badge) => void;
}

export const BadgesGallerySection: React.FC<BadgesGallerySectionProps> = ({ user, onBadgeClick }) => {
  const [filter, setFilter] = useState<'todas' | 'conquistadas' | 'em_progresso'>('todas');
  const [selectedBadgeModal, setSelectedBadgeModal] = useState<Badge | null>(null);

  const badges = getBadgesWithUserProgress(user);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const unlockedPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = badges.filter((b) => {
    if (filter === 'conquistadas') return b.unlocked;
    if (filter === 'em_progresso') return !b.unlocked;
    return true;
  });

  const getRarityBadgeStyle = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Lendário':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-black';
      case 'Épico':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-black';
      case 'Raro':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700 font-medium';
    }
  };

  const handleCardClick = (badge: Badge) => {
    if (badge.unlocked) {
      fireConfetti(40, 50);
    }
    setSelectedBadgeModal(badge);
    if (onBadgeClick) onBadgeClick(badge);
  };

  return (
    <div className="bg-[#0f172a] rounded-[32px] p-6 md:p-8 border border-amber-500/20 shadow-2xl space-y-6">
      {/* Header with Title & Overall Collection Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-widest">
              CONQUISTAS & MEDALHAS SPARTA 🛡️
            </span>
            <span className="text-xs font-bold text-slate-400">• Galeria do Guerreiro</span>
          </div>
          <h2 className="font-sparta text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
            Insígnias de Honra e Combate
            <span className="material-symbols-outlined text-amber-400 fill-1 text-2xl">
              workspace_premium
            </span>
          </h2>
        </div>

        {/* Collection Completion Widget */}
        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800">
          <div>
            <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
              <span>Medalhas Vencidas</span>
              <span className="text-amber-400 font-mono">{unlockedCount} / {totalCount} ({unlockedPercent}%)</span>
            </div>
            <div className="w-36 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-700 shadow-[0_0_8px_#f59e0b]" 
                style={{ width: `${unlockedPercent}%` }}
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-lg">
            🎖️
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('todas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'todas'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            onClick={() => setFilter('conquistadas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'conquistadas'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Conquistadas ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('em_progresso')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'em_progresso'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bloqueadas ({totalCount - unlockedCount})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          💡 Clique na badge para ver os critérios de conquista e bônus de XP
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const progressPercent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => handleCardClick(badge)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 group ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#070a12] border-amber-500/40 shadow-lg hover:border-amber-400'
                  : 'bg-slate-900/60 border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Badge Icon & Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105 shadow-md ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 border border-amber-300'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {badge.icon}
                    </span>
                  </div>
                  <div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRarityBadgeStyle(badge.rarity)}`}>
                      {badge.rarity || 'Comum'}
                    </span>
                    <h4 className="font-sparta font-bold text-sm text-slate-100 mt-0.5 line-clamp-1">
                      {badge.title}
                    </h4>
                  </div>
                </div>

                {/* Status Indicator */}
                {badge.unlocked ? (
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0" title="Medalha Desbloqueada">
                    <span className="material-symbols-outlined text-base">check</span>
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center flex-shrink-0" title="Medalha Bloqueada">
                    <span className="material-symbols-outlined text-sm">lock</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {badge.description}
              </p>

              {/* Progress & Reward */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400">Progresso</span>
                  <span className={badge.unlocked ? 'text-amber-400 font-mono' : 'text-slate-500 font-mono'}>
                    {badge.progress} / {badge.maxProgress}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-slate-700'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="font-extrabold text-amber-400 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">bolt</span>
                    +{badge.rewardXp} XP
                  </span>
                  {badge.unlocked && (
                    <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest">
                      DESBLOQUEADA
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal Overlay */}
      {selectedBadgeModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f172a] rounded-[32px] w-full max-w-md p-6 space-y-5 shadow-2xl border border-amber-500/40 text-center relative overflow-hidden text-slate-100">
            
            {/* Background Glow */}
            <div className={`absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              selectedBadgeModal.unlocked ? 'bg-amber-500/20' : 'bg-slate-800/30'
            }`} />

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedBadgeModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 border border-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                selectedBadgeModal.unlocked
                  ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 border border-amber-300 animate-bounce'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                <span className="material-symbols-outlined text-4xl">
                  {selectedBadgeModal.icon}
                </span>
              </div>

              <div className="space-y-1">
                <span className={`text-xs px-3 py-0.5 rounded-full border inline-block ${getRarityBadgeStyle(selectedBadgeModal.rarity)}`}>
                  Raridade: {selectedBadgeModal.rarity || 'Comum'}
                </span>
                <h3 className="font-sparta text-xl font-extrabold text-amber-300">
                  {selectedBadgeModal.title}
                </h3>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                {selectedBadgeModal.description}
              </p>
            </div>

            {/* Reward & Status breakdown */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Recompensa de XP:</span>
                <span className="font-black text-amber-400 flex items-center gap-1 text-sm font-mono">
                  <span className="material-symbols-outlined text-base">bolt</span>
                  +{selectedBadgeModal.rewardXp} XP
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Objetivo de Combate</span>
                  <span className="font-mono">{selectedBadgeModal.progress} / {selectedBadgeModal.maxProgress}</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#f59e0b]"
                    style={{ width: `${Math.min(100, (selectedBadgeModal.progress / selectedBadgeModal.maxProgress) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-amber-300 font-semibold pt-1">
                {selectedBadgeModal.unlocked ? (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Insígnia de Honra conquistada!
                  </span>
                ) : (
                  <span className="text-slate-400">
                    🔒 Conclua o objetivo para destravar esta insígnia.
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedBadgeModal(null)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider cursor-pointer shadow-lg"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
