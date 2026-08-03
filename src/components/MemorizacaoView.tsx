import React, { useState } from 'react';
import { Flashcard, Mnemonic } from '../types';

interface MemorizacaoViewProps {
  flashcards: Flashcard[];
  mnemonics: Mnemonic[];
  onStartFlashcards: () => void;
  onSelectMnemonic: (mn: Mnemonic) => void;
  onSendAICommand: (command: string) => void;
}

export const MemorizacaoView: React.FC<MemorizacaoViewProps> = ({
  flashcards,
  mnemonics,
  onStartFlashcards,
  onSelectMnemonic,
  onSendAICommand,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleCommandSubmit = async (text: string) => {
    if (!text.trim()) return;
    setLoadingAi(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: 'Central de Fixação e Memorização' }),
      });
      const data = await res.json();
      setAiResult(data.reply || 'Dica jurídica gerada com sucesso!');
    } catch (e) {
      setAiResult('Para memorizar o Art. 5º da CF (Vida, Liberdade, Igualdade, Segurança, Propriedade), use o mnemônico VLPSI. A retenção do artigo é ativada por revisões espaçadas de 24h!');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="pt-20 pb-28 px-4 md:px-12 max-w-[1280px] mx-auto animate-fadeIn space-y-8">
      {/* AI Memorization Header */}
      <section>
        <div className="glass-ai rounded-[36px] p-7 md:p-10 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#6d3bd7]/10 blur-[100px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#006e2f]/10 blur-[60px] -z-10 rounded-full" />

          <div className="flex-1 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6d3bd7]/10 text-[#6d3bd7] border border-[#6d3bd7]/20">
              <span className="material-symbols-outlined text-sm fill-1">psychology</span>
              <span className="font-semibold text-xs tracking-wider uppercase">Memorização Inteligente</span>
            </div>

            <h2 className="font-headline-xl text-3xl md:text-5xl font-extrabold text-[#0b1c30] leading-tight">
              Fixação de <br className="hidden md:block" />
              <span className="text-[#6d3bd7]">Alto Impacto</span>
            </h2>

            <p className="font-body-lg text-sm md:text-base text-[#3d4a3d] max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Nossa IA identificou que você esquece termos de{' '}
              <span className="text-[#6d3bd7] font-semibold underline decoration-[#6d3bd7]/30 underline-offset-4">
                Direito Penal
              </span>{' '}
              após 3 dias. Reajustamos seu ciclo de repetição para garantir a retenção máxima.
            </p>

            <div className="pt-2">
              <button
                onClick={onStartFlashcards}
                className="w-full md:w-auto bg-[#6d3bd7] hover:bg-[#5516be] text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl tertiary-glow active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">analytics</span>
                Ver Ciclo de Revisão
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Memorization Tools */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* PDF Memorization Progress */}
        <div className="md:col-span-7 bg-white rounded-[32px] p-7 md:p-8 shadow-sm border border-[#bccbb9]/30 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-[#006e2f] animate-pulse" />
                <span className="text-xs font-bold text-[#006e2f] tracking-widest uppercase">ESTADO ATUAL</span>
              </div>
              <h3 className="font-headline-md text-xl md:text-2xl font-bold text-[#0b1c30]">Memorização de PDF</h3>
              <p className="text-xs md:text-sm text-[#545f73] mt-1 font-medium">
                Estatuto do Servidor Público (Legislação Municipal)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/20 text-[#006e2f] flex items-center justify-center border border-[#006e2f]/10">
              <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs text-[#545f73] mb-1 font-medium">Retenção de Longo Prazo</span>
                <span className="font-headline-xl text-[#006e2f] text-3xl md:text-4xl font-extrabold">68%</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#545f73] block uppercase tracking-wider font-bold">STATUS</span>
                <span className="text-sm font-bold text-[#006e2f]">Estável</span>
              </div>
            </div>

            <div className="relative h-4 w-full bg-[#e5eeff] rounded-full overflow-hidden p-0.5">
              <div
                className="bg-[#006e2f] h-full rounded-full transition-all duration-1000 ease-out premium-glow relative"
                style={{ width: '68%' }}
              >
                <div className="absolute inset-0 ai-shimmer opacity-40" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#eff4ff] rounded-2xl border border-[#bccbb9]/20">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#006e2f] text-xl">schedule</span>
                <p className="text-xs text-[#545f73]">Próxima revisão recomendada</p>
              </div>
              <span className="text-xs font-bold text-[#0b1c30]">Em 14 horas</span>
            </div>
          </div>
        </div>

        {/* Flashcards Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#6d3bd7]/10 to-[#6d3bd7]/5 rounded-[32px] p-7 md:p-8 flex flex-col justify-between border border-[#6d3bd7]/20 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#6d3bd7] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-xl fill-1">style</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-[#23005c]">Flashcards</h3>
            </div>
            <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold text-[#23005c] uppercase border border-white/60 shadow-xs">
              84% Meta
            </span>
          </div>

          <div className="space-y-4 flex-1">
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-[#6d3bd7]/10">
              <p className="text-[10px] text-[#6d3bd7] font-bold uppercase mb-1 tracking-widest">Deck em Foco</p>
              <p className="font-bold text-sm text-[#0b1c30] leading-snug">
                Direito Penal: Crimes contra a Adm. Pública
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <span className="flex-1 px-3 py-2 bg-[#6d3bd7]/10 rounded-xl text-xs font-bold text-[#6d3bd7] text-center border border-[#6d3bd7]/10">
                15 Novos
              </span>
              <span className="flex-1 px-3 py-2 bg-[#ffdad6] text-[#93000a] rounded-xl text-xs font-bold text-center border border-[#ffdad6]">
                8 Críticos
              </span>
            </div>
          </div>

          <button
            onClick={onStartFlashcards}
            className="mt-6 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between w-full p-4 bg-[#6d3bd7] hover:bg-[#5516be] rounded-2xl shadow-lg tertiary-glow transition-all cursor-pointer"
          >
            Praticar Agora
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>

        {/* Mnemonic Card */}
        <div className="md:col-span-6 bg-white rounded-[32px] p-7 border border-[#bccbb9]/30 flex items-center gap-6 shadow-sm hover:border-[#006e2f]/40 transition-all cursor-pointer group">
          <div className="w-16 h-16 rounded-2xl bg-[#006e2f]/10 flex-shrink-0 flex items-center justify-center border border-[#006e2f]/20">
            <span className="material-symbols-outlined text-3xl text-[#006e2f] fill-1">lightbulb</span>
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-[#006e2f] uppercase tracking-widest mb-1 block">
              Macetes de Legislação
            </span>
            <h4 className="font-headline-md text-lg font-bold text-[#0b1c30] mb-1">Mnemônicos da Lei Orgânica</h4>
            <p className="text-xs text-[#545f73] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006e2f]" />
              "LIMPE" e outros 12 truques
            </p>
          </div>
          <button
            onClick={() => onSelectMnemonic(mnemonics[0])}
            className="w-11 h-11 rounded-xl border border-[#bccbb9]/30 flex items-center justify-center group-hover:bg-[#006e2f] group-hover:text-white group-hover:border-[#006e2f] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">bookmark</span>
          </button>
        </div>

        {/* AI Optimization Section */}
        <div className="md:col-span-6 bg-[#d5e0f8]/50 rounded-[32px] p-7 border border-[#bccbb9]/30 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 bg-[#545f73]/10 rounded-lg">
                <span className="material-symbols-outlined text-[#545f73] text-xl fill-1">auto_awesome</span>
              </div>
              <h4 className="font-headline-md text-base md:text-lg font-bold text-[#0b1c30]">
                Otimização QuickEvolve AI
              </h4>
            </div>
            <p className="text-xs md:text-sm text-[#586377] leading-relaxed">
              Nosso algoritmo analisa seu <span className="font-bold text-[#0b1c30]">tempo de resposta</span> e{' '}
              <span className="font-bold text-[#0b1c30]">taxa de erro</span>. Ele prioriza conteúdos prestes a serem
              esquecidos, otimizando seu ciclo de estudos em <span className="font-extrabold text-[#006e2f]">40%</span>.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 border border-white rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#006e2f] animate-pulse" />
              <span className="text-[10px] font-bold text-[#0b1c30] uppercase tracking-wider">
                Algoritmo Ativo • Ciclo Otimizado
              </span>
            </div>
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#545f73] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                IA
              </div>
              <div className="w-7 h-7 rounded-full bg-[#e5eeff] border-2 border-white flex items-center justify-center text-[#545f73]">
                <span className="material-symbols-outlined text-xs">database</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Command Center Section */}
      <section className="mt-8 bg-[#0b1c30] text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#6bff8f]/20 rounded-full flex items-center justify-center mb-6 border border-[#6bff8f]/30">
            <span className="material-symbols-outlined text-3xl text-[#6bff8f] fill-1">smart_toy</span>
          </div>

          <h2 className="font-headline-xl text-2xl md:text-4xl font-extrabold mb-6 leading-tight">
            Como posso ajudar a<br />
            <span className="text-[#6bff8f]">fixar o conteúdo?</span>
          </h2>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-3 justify-center mb-8 max-w-2xl">
            {[
              'Crie um mnemônico para Art. 5º',
              'Resuma este PDF em 5 flashcards',
              'Quais questões mais caem disso?',
            ].map((promptText) => (
              <button
                key={promptText}
                onClick={() => {
                  setCommandInput(promptText);
                  handleCommandSubmit(promptText);
                }}
                className="px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-white/90 hover:bg-white/15 hover:border-white/30 cursor-pointer transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xs text-[#6bff8f]">add_circle</span>
                "{promptText}"
              </button>
            ))}
          </div>

          {/* Prompt Form Input */}
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCommandSubmit(commandInput);
              }}
              placeholder="Comando da IA: Descreva o que você quer memorizar..."
              className="w-full h-16 bg-white/10 border border-white/20 rounded-2xl px-6 pr-16 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#6bff8f] focus:ring-1 focus:ring-[#6bff8f] transition-all font-medium"
            />
            <button
              onClick={() => handleCommandSubmit(commandInput)}
              disabled={loadingAi}
              className="absolute right-2.5 top-2.5 w-11 h-11 bg-[#6bff8f] text-[#002109] rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer hover:bg-[#4ae176]"
            >
              {loadingAi ? (
                <div className="w-5 h-5 border-2 border-[#002109] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-xl font-bold">send</span>
              )}
            </button>
          </div>

          {/* AI Result Box */}
          {aiResult && (
            <div className="mt-6 w-full max-w-2xl bg-white/10 border border-[#6bff8f]/30 rounded-2xl p-5 text-left text-xs md:text-sm text-white/90 animate-fadeIn space-y-2">
              <div className="flex items-center gap-2 text-[#6bff8f] font-bold text-xs uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-base fill-1">auto_awesome</span>
                Resposta da IA Mentor QuickEvolve:
              </div>
              <p className="whitespace-pre-line leading-relaxed">{aiResult}</p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#6bff8f]" />
            Processamento em Tempo Real • Gemini AI Powered
          </div>
        </div>
      </section>
    </div>
  );
};
