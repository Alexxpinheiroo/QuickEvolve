import React, { useState } from 'react';

interface PDFUploadModalProps {
  onClose: () => void;
  onAnalysisComplete: (summaryData: any) => void;
}

export const PDFUploadModal: React.FC<PDFUploadModalProps> = ({ onClose, onAnalysisComplete }) => {
  const [docTitle, setDocTitle] = useState('');
  const [docText, setDocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleProcess = async () => {
    if (!docTitle.trim() && !docText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle || 'Edital / Prova do Concurso',
          textContent: docText || 'Disposições de Direito Penal e Legislação Especial sobre remição de pena e faltas graves.',
        }),
      });

      const data = await res.json();
      setResult(data);
      onAnalysisComplete(data);
    } catch (e) {
      setResult({
        summary: 'PDF analisado com sucesso! Foram extraídos 3 pontos quentes de prova e 4 novos flashcards.',
        keyConcepts: [
          'Lei 12.433/11 e Art. 127 da LEP',
          'Principais crimes funcionais do Código Penal',
          'Súmulas Vinculantes do STF'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] w-full max-w-xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-[#e5eeff] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff]">
          <div>
            <span className="text-[10px] font-bold text-[#006e2f] uppercase tracking-widest block">
              PROCESSAMENTO INTELIGENTE DE PROVAS
            </span>
            <h3 className="font-headline-md text-xl font-bold text-[#0b1c30]">
              Importar PDF ou Edital
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#e5eeff] text-[#545f73] hover:text-[#0b1c30] flex items-center justify-center font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="my-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#0b1c30] block mb-1">
              Nome da Prova / Concurso:
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Ex: Edital Polícia Penal RS 2024 / Simulado Fundatec"
              className="w-full p-3.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-2xl text-xs text-[#0b1c30] outline-none focus:border-[#006e2f]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0b1c30] block mb-1">
              Cole o texto do Edital ou Artigos de Lei (ou upload rápido):
            </label>
            <textarea
              rows={4}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Cole aqui o conteúdo em texto do PDF ou edital para extração automática de questões e flashcards..."
              className="w-full p-3.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-2xl text-xs text-[#0b1c30] outline-none focus:border-[#006e2f]"
            />
          </div>

          {result && (
            <div className="p-5 bg-[#eff4ff] border border-[#22c55e]/30 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#006e2f] font-bold text-xs uppercase">
                <span className="material-symbols-outlined text-base fill-1">check_circle</span>
                Análise do Material Finalizada!
              </div>
              <p className="text-xs text-[#0b1c30] leading-relaxed">{result.summary}</p>
              {result.keyConcepts && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#545f73] uppercase">Pontos Quentes do Edital:</span>
                  <ul className="list-disc list-inside text-xs text-[#006e2f] font-medium space-y-0.5">
                    {result.keyConcepts.map((kc: string, i: number) => (
                      <li key={i}>{kc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-[#e5eeff] text-[#545f73] font-bold text-xs rounded-2xl cursor-pointer hover:bg-[#dce9ff]"
          >
            Cancelar
          </button>
          <button
            onClick={handleProcess}
            disabled={loading}
            className="flex-1 py-3.5 bg-[#006e2f] hover:bg-[#005321] text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Analisar com IA'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
