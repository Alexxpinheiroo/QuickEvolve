import React from 'react';
import { UserProfile } from '../types';
import { getBadgesWithUserProgress } from '../data/badgesData';

interface SettingsDrawerProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateGoal: (newGoal: number) => void;
  onLoginGoogle?: () => void;
  onLogoutGoogle?: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  user,
  onClose,
  onUpdateGoal,
  onLoginGoogle,
  onLogoutGoogle,
  isFocusMode,
  onToggleFocusMode
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff]">
            <h3 className="font-headline-md text-xl font-bold text-[#0b1c30]">
              Perfil & Sincronização Google
            </h3>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#e5eeff] text-[#545f73] hover:text-[#0b1c30] flex items-center justify-center font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* User info card & Google status */}
          <div className="p-5 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-14 h-14 rounded-full border-2 border-[#22c55e] object-cover"
              />
              <div>
                <h4 className="font-bold text-base text-[#0b1c30]">{user.name}</h4>
                <p className="text-xs text-[#006e2f] font-bold">{user.rank}</p>
                <p className="text-[11px] text-[#545f73]">{user.email || 'Conta não vinculada'}</p>
              </div>
            </div>

            {user.googleConnected ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-blue-900 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-blue-600">cloud_done</span>
                  Sincronizado via Firestore
                </span>
                {onLogoutGoogle && (
                  <button
                    onClick={onLogoutGoogle}
                    className="text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Sair
                  </button>
                )}
              </div>
            ) : (
              onLoginGoogle && (
                <button
                  onClick={onLoginGoogle}
                  className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-300 text-[#0b1c30] rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Conectar Conta Google</span>
                </button>
              )
            )}
          </div>

          {/* Badges Preview Card */}
          <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#22c55e] text-base fill-1">workspace_premium</span>
                Medalhas Desbloqueadas
              </span>
              <span className="text-[11px] font-extrabold text-[#006e2f]">
                {getBadgesWithUserProgress(user).filter(b => b.unlocked).length} / {getBadgesWithUserProgress(user).length}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {getBadgesWithUserProgress(user).map((b) => (
                <div
                  key={b.id}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${
                    b.unlocked
                      ? 'bg-[#22c55e]/15 text-[#006e2f] border-[#22c55e]/30 shadow-xs'
                      : 'bg-slate-100 text-slate-300 border-slate-200'
                  }`}
                  title={`${b.title} (${b.unlocked ? 'Desbloqueada' : 'Bloqueada'})`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {b.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modo Foco Toggle */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isFocusMode 
              ? 'bg-slate-900 text-white border-amber-500/50 shadow-lg' 
              : 'bg-[#f8f9ff] text-[#0b1c30] border-[#e5eeff]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-xl ${isFocusMode ? 'text-amber-400' : 'text-[#006e2f]'}`}>
                  center_focus_strong
                </span>
                <div>
                  <span className="text-xs font-bold block">Modo Foco Spartan</span>
                  <span className={`text-[11px] block ${isFocusMode ? 'text-slate-300' : 'text-[#545f73]'}`}>
                    Filtro em escala de cinza e distração reduzida nas sessões
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleFocusMode}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFocusMode ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isFocusMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {isFocusMode && (
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">visibility_off</span>
                Ativo: Escala de cinza e alto contraste nas abas Simulados e Memorização.
              </div>
            )}
          </div>

          {/* Daily study goal target */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0b1c30] block">
              Meta Diária de Estudo (Minutos):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 60, 90].map((min) => (
                <button
                  key={min}
                  onClick={() => onUpdateGoal(min)}
                  className={`py-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    user.dailyGoalMinutes === min
                      ? 'bg-[#006e2f] text-white border-[#006e2f]'
                      : 'bg-[#f8f9ff] text-[#0b1c30] border-[#e5eeff] hover:bg-[#e5eeff]'
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>

          {/* Target careers */}
          <div className="p-5 bg-[#eff4ff] rounded-2xl border border-[#d3e4fe] space-y-2">
            <span className="text-xs font-bold text-[#006e2f] uppercase tracking-wider block">
              Foco Atual do Edital
            </span>
            <p className="text-xs text-[#0b1c30] font-semibold">
              👮 Carreiras Policiais (Polícia Penal RS, SUSEPE, PC-RS) e Guarda Municipal.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="text-xs font-bold text-amber-900 block">Ofensiva Ativa</span>
              <span className="text-xs text-amber-800">{user.streakDays} dias seguidos praticando!</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#0b1c30] hover:bg-[#006e2f] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer mt-6"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};
