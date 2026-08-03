import React, { useState } from 'react';
import { Exam, Question } from '../types';
import { fireConfetti, fireLevelUpCelebration } from '../lib/confetti';

interface ExamModalProps {
  exam: Exam;
  onClose: () => void;
  onFinishExam: (score: number, total: number, xpEarned: number) => void;
}

export const ExamModal: React.FC<ExamModalProps> = ({ exam, onClose, onFinishExam }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: Question = exam.questions[currentIdx] || exam.questions[0];

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (isFinished) return;
    setSelectedOptions((prev) => ({ ...prev, [qIdx]: optionIdx }));
    setShowExplanation((prev) => ({ ...prev, [qIdx]: true }));
  };

  const calculateScore = () => {
    let correct = 0;
    exam.questions.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correctOptionIndex) correct++;
    });
    return correct;
  };

  const handleFinish = () => {
    setIsFinished(true);
    const correctCount = calculateScore();
    const xp = correctCount * 150 + 100;
    
    // Trigger visual confetti fireworks!
    if (correctCount > 0) {
      fireLevelUpCelebration();
    } else {
      fireConfetti(60, 50);
    }

    onFinishExam(correctCount, exam.questions.length, xp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#e5eeff]">
        {/* Header */}
        <div className="p-6 bg-[#f8f9ff] border-b border-[#e5eeff] flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-[#006e2f] uppercase tracking-widest block">
              SIMULADO EM ANDAMENTO
            </span>
            <h3 className="font-headline-md text-xl font-bold text-[#0b1c30]">
              {exam.title} - {exam.subtitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#545f73] hover:text-[#0b1c30] flex items-center justify-center font-bold text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#e5eeff] h-2">
          <div
            className="bg-[#006e2f] h-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / exam.questions.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {!isFinished ? (
            <>
              {/* Question metadata */}
              <div className="flex justify-between items-center text-xs text-[#545f73]">
                <span className="font-bold uppercase tracking-wider text-[#006e2f] bg-[#006e2f]/10 px-3 py-1 rounded-full">
                  Questão {currentIdx + 1} de {exam.questions.length} • {currentQ.subject}
                </span>
                <span className="font-semibold bg-[#e5eeff] px-2.5 py-1 rounded-lg">
                  {currentQ.difficulty}
                </span>
              </div>

              {/* Question text */}
              <h4 className="font-body-lg text-base md:text-lg text-[#0b1c30] font-semibold leading-relaxed">
                {currentQ.questionText}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedOptions[currentIdx] === optIdx;
                  const isCorrect = currentQ.correctOptionIndex === optIdx;
                  const hasAnswered = selectedOptions[currentIdx] !== undefined;

                  let btnStyle = 'border-[#e5eeff] bg-white text-[#0b1c30] hover:bg-[#e5eeff]/50';
                  if (hasAnswered) {
                    if (isCorrect) btnStyle = 'border-[#22c55e] bg-[#22c55e]/10 text-[#004b1e] font-bold';
                    else if (isSelected) btnStyle = 'border-[#ba1a1a] bg-[#ffdad6] text-[#93000a] font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentIdx, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Legal explanation */}
              {showExplanation[currentIdx] && (
                <div className="p-5 rounded-2xl bg-[#eff4ff] border border-[#d3e4fe] animate-fadeIn space-y-2">
                  <div className="flex items-center gap-2 text-[#006e2f] font-bold text-xs uppercase">
                    <span className="material-symbols-outlined text-lg fill-1">gavel</span>
                    Gabarito Comentado e Fundamentação Legal:
                  </div>
                  <p className="text-xs md:text-sm text-[#0b1c30] leading-relaxed">{currentQ.explanation}</p>
                  {currentQ.lawReference && (
                    <p className="text-[11px] font-bold text-[#6d3bd7] bg-white/80 p-2 rounded-xl inline-block border border-[#6d3bd7]/20">
                      📜 Referência: {currentQ.lawReference}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Result screen */
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto text-[#006e2f]">
                <span className="material-symbols-outlined text-5xl fill-1">verified</span>
              </div>
              <h3 className="font-headline-xl text-3xl font-extrabold text-[#0b1c30]">
                Simulado Concluído!
              </h3>
              <p className="text-sm text-[#545f73]">
                Você acertou <strong className="text-[#006e2f]">{calculateScore()}</strong> de{' '}
                <strong>{exam.questions.length}</strong> questões.
              </p>

              <div className="p-6 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] inline-block max-w-sm">
                <span className="text-xs text-[#545f73] uppercase font-bold tracking-wider block mb-1">
                  Recompensa Conquistada
                </span>
                <span className="text-2xl font-extrabold text-[#006e2f]">
                  +{calculateScore() * 150 + 100} XP 🔥
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-5 bg-[#f8f9ff] border-t border-[#e5eeff] flex justify-between items-center">
          {!isFinished ? (
            <>
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="px-5 py-2.5 rounded-xl border border-[#e5eeff] text-xs font-bold text-[#545f73] disabled:opacity-40 cursor-pointer hover:bg-white"
              >
                Anterior
              </button>

              {currentIdx < exam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-[#006e2f] text-white text-xs font-bold cursor-pointer hover:bg-[#005321]"
                >
                  Próxima Questão
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-xl bg-[#6d3bd7] text-white text-xs font-bold cursor-pointer hover:bg-[#5516be] shadow-md"
                >
                  Finalizar e Ver Desempenho
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#006e2f] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-[#005321]"
            >
              Voltar à Central de Simulados
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
