import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';

interface IATutorChatViewProps {
  user: UserProfile;
  onStartMnemonicCreator: () => void;
  onOpenOriginalQuestion: () => void;
}

export const IATutorChatView: React.FC<IATutorChatViewProps> = ({
  user,
  onStartMnemonicCreator,
  onOpenOriginalQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: `═══════════════════════════════════════════════════════════
🔥 ARES - SISTEMA DE TREINAMENTO COGNITIVO DE ELITE 🔥
═══════════════════════════════════════════════════════════

"Eu sou ARES. Já treinei 10.000 guerreiros. 9.872 foram aprovados.
Você acha que é melhor que a média? Prove.

Antes de começarmos, responda sem vacilar: VOCÊ TEM MEDO DE FRACASSAR NO SEU CONCURSO?"`,
      time: '08:00',
      legalConcept: true,
      actions: ['Sim, tenho medo', 'Não, nasci para vencer', '/treinar', '/status', '/relatorio', '/desafio'],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyForApi }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Excelente tese jurídica! Mantenha os estudos firmes.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: data.suggestedActions,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: 'Ótima indagação! No âmbito da legislação para carreiras policiais, essa matéria possui altíssima incidência nas provas da Fundatec e La Salle. Lembre-se sempre de conferir as Súmulas do STF e STJ!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-28 px-4 md:px-12 max-w-5xl mx-auto animate-fadeIn flex flex-col gap-6">
      {/* AI Hero Banner */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#070a12] rounded-[36px] p-7 md:p-9 flex flex-col md:flex-row items-center gap-6 relative border-2 border-amber-500/40 shadow-2xl overflow-hidden gold-glow">
        <div className="flex-1 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-md">
            <span className="material-symbols-outlined text-[18px] fill-1 animate-pulse">swords</span>
            <span className="text-xs font-black tracking-wider font-sparta">ARES • SISTEMA COGNITIVO DE ELITE</span>
          </div>
          <h2 className="font-sparta text-2xl md:text-4xl font-black text-slate-100 leading-tight mb-2">
            "Conhecimento não se implora, se CONQUISTA."
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-lg">
            Análise preditiva, método socrático invertido e treinamento de resiliência. ARES não ensina: ARES FORJA campeões.
          </p>
        </div>

        {/* Floating Warrior Badge */}
        <div className="w-32 h-32 md:w-44 md:h-44 relative flex-shrink-0 flex items-center justify-center">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-red-600 p-1 shadow-2xl animate-float flex items-center justify-center border-2 border-amber-300 gold-glow">
            <div className="w-full h-full bg-[#0f172a] rounded-full flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-6xl fill-1">military_tech</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Box */}
      <section className="bg-[#0f172a] rounded-[36px] border border-amber-500/20 flex flex-col overflow-hidden min-h-[520px] shadow-2xl">
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6 max-h-[500px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${
                m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 md:w-10 md:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black'
                    : 'bg-gradient-to-tr from-red-800 to-amber-600 border border-amber-500/50 text-amber-300 gold-glow'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {m.sender === 'user' ? 'person' : 'shield'}
                </span>
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-2 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-5 rounded-3xl text-sm md:text-base leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-tr-none shadow-lg'
                      : 'bg-slate-900 text-slate-100 rounded-tl-none border border-amber-500/30 shadow-md font-mono'
                  }`}
                >
                  {m.legalConcept && (
                    <span className="inline-block px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold rounded-full mb-3 border border-amber-500/30 uppercase tracking-widest font-sparta">
                      🏛️ MESTRE ARES • DIRETRIZ
                    </span>
                  )}
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>

                {/* Actions */}
                {m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {m.actions.map((act) => (
                      <button
                        key={act}
                        onClick={() => {
                          if (act.includes('Mnemônico')) onStartMnemonicCreator();
                          else if (act.includes('Questão')) onOpenOriginalQuestion();
                          else handleSend(act);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md flex items-center gap-1.5 cursor-pointer gold-glow"
                      >
                        <span className="material-symbols-outlined text-base">
                          {act.startsWith('/') ? 'terminal' : act.includes('Mnemônico') ? 'psychology' : 'bolt'}
                        </span>
                        {act}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 font-medium px-1">
                  {m.sender === 'user' ? `${user.name} • ${m.time}` : `Mestre ARES • ${m.time}`}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="w-9 h-9 rounded-2xl bg-red-900 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl animate-spin">cyclone</span>
              </div>
              <div className="p-4 bg-slate-900 rounded-3xl rounded-tl-none border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ARES processando diagnóstico cognitivo e jurisprudência...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-3 flex gap-2.5 overflow-x-auto no-scrollbar bg-slate-950/80 border-t border-slate-800">
          {[
            { label: '⚡ /treinar (Sessão Diária)', cmd: '/treinar' },
            { label: '📊 /status (Raio-X)', cmd: '/status' },
            { label: '📜 /relatorio (Semanal)', cmd: '/relatorio' },
            { label: '🔥 /desafio (Modo Espartano)', cmd: '/desafio' },
            { label: '💡 Socrático Invertido', cmd: 'Me faça uma pergunta difícil de Direito Penal' },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleSend(chip.cmd)}
              className="flex-shrink-0 px-4 py-2 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-bold hover:border-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-5 md:p-6 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Digite seu comando (/treinar, /status, /relatorio, /desafio) ou dúvida..."
                className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl px-5 pr-12 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500/60 transition-all shadow-inner font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => setInputVal('/treinar')}
                  className="material-symbols-outlined p-1 hover:text-amber-400 transition-colors cursor-pointer text-xl"
                  title="Comando Rápido"
                >
                  terminal
                </button>
              </div>
            </div>

            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 cursor-pointer font-black"
            >
              <span className="material-symbols-outlined text-2xl font-bold">send</span>
            </button>
          </div>
          <p className="text-[10px] text-center mt-3 text-slate-500 font-bold tracking-wider uppercase font-mono">
            ARES COGNITIVE ENGINE • TREINAMENTO TÁTICO MILITAR DE ELITE 2026
          </p>
        </div>
      </section>
    </div>
  );
};
