import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onOpenPDFUpload: () => void;
  onOpenSettings: () => void;
  onLoginGoogle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenPDFUpload, onOpenSettings, onLoginGoogle }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-amber-500/20 shadow-xl">
      <div className="flex justify-between items-center px-4 md:px-12 py-3 w-full max-w-[1280px] mx-auto">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 p-0.5 overflow-hidden shadow-md bg-slate-900 cursor-pointer relative" onClick={onOpenSettings}>
            <img
              alt="Profile Avatar"
              className="w-full h-full rounded-full object-cover"
              src={user.avatarUrl}
            />
            {user.googleConnected && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950" title="Conta Google Sincronizada" />
            )}
          </div>
          <div>
            <h1 className="font-sparta text-xl md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 flex items-center gap-2">
              QuickEvolve <span className="text-sm font-sans px-2 py-0.5 bg-red-950/80 text-red-400 border border-red-800/60 rounded-md uppercase tracking-widest font-extrabold hidden sm:inline">SPARTA</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Google Login or Sync status */}
          {!user.googleConnected && onLoginGoogle ? (
            <button
              onClick={onLoginGoogle}
              className="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-xl font-bold text-xs border border-amber-500/30 shadow-xs transition-all cursor-pointer"
              title="Entrar com Conta Google para salvar evolução"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sincronizar Google</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-amber-500/30">
              <span className="material-symbols-outlined text-sm text-amber-400">cloud_done</span>
              <span>Nuvem Ativa</span>
            </div>
          )}

          <button
            onClick={onOpenPDFUpload}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2 rounded-xl font-bold text-xs md:text-sm transition-all border border-slate-700 active:scale-95 cursor-pointer shadow-xs"
            title="Anexar Edital ou Prova em PDF"
          >
            <span className="material-symbols-outlined text-[20px] text-amber-400">upload_file</span>
            <span className="hidden md:inline">Importar Edital</span>
          </button>

          <div
            className="bg-gradient-to-r from-red-800 to-amber-600 text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-amber-500/40 hover:scale-105 transition-transform cursor-pointer font-black text-sm"
            onClick={onOpenSettings}
            title={`${user.streakDays} dias de ofensiva seguidos!`}
          >
            <span>{user.streakDays}</span>
            <span className="text-base">⚔️</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="material-symbols-outlined text-slate-400 hover:text-amber-400 hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
            title="Configurações e Perfil"
          >
            settings
          </button>
        </div>
      </div>
    </header>
  );
};
