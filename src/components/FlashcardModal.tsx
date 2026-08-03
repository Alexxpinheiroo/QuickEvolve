import React, { useState } from 'react';
import { Flashcard } from '../types';
import { fireConfetti } from '../lib/confetti';

interface FlashcardModalProps {
  cards: Flashcard[];
  onClose: () => void;
  onFinishSession: (cardsReviewed: number, xpGained: number) => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  cards,
  onClose,
  onFinishSession,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const card = cards[currentIdx] || cards[0];

  const handleRate = (rating: 'easy' | 'medium' | 'hard' | 'again') => {
    setIsFlipped(false);
    setReviewedCount((prev) => prev + 1);

    if (currentIdx < cards.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      fireConfetti(120, 80);
      onFinishSession(cards.length, cards.length * 50 + 100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] w-full max-w-xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-[#e5eeff] min-h-[480px]">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff]">
          <div>
            <span className="text-[10px] font-bold text-[#6d3bd7] uppercase tracking-widest block">
              SESSÃO DE FLASHCARDS
            </span>
            <h3 className="font-headline-md text-base md:text-lg font-bold text-[#0b1c30]">
              {card.deckName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#e5eeff] text-[#545f73] hover:text-[#0b1c30] flex items-center justify-center font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!isFinished ? (
          <>
            {/* Card Counter */}
            <div className="text-center text-xs text-[#545f73] font-bold uppercase tracking-wider my-2">
              Cartão {currentIdx + 1} de {cards.length}
            </div>

            {/* 3D Flipper Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="my-4 min-h-[220px] p-8 rounded-3xl bg-gradient-to-br from-[#f8f9ff] to-[#e5eeff] border border-[#6d3bd7]/20 flex flex-col items-center justify-center text-center cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 relative group"
            >
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase px-3 py-1 bg-white rounded-full text-[#6d3bd7] border border-[#6d3bd7]/10 shadow-2xs">
                {isFlipped ? 'RESPOSTA' : 'CLIQUE PARA VIRAR 🔄'}
              </span>

              <p className="font-headline-md text-base md:text-xl font-bold text-[#0b1c30] leading-relaxed whitespace-pre-line">
                {isFlipped ? card.back : card.front}
              </p>
            </div>

            {/* Rating controls */}
            {isFlipped ? (
              <div className="grid grid-cols-4 gap-2 pt-2 animate-fadeIn">
                <button
                  onClick={() => handleRate('again')}
                  className="py-3 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-bold hover:brightness-95 cursor-pointer"
                >
                  Errei
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="py-3 rounded-2xl bg-amber-100 text-amber-800 text-xs font-bold hover:brightness-95 cursor-pointer"
                >
                  Difícil
                </button>
                <button
                  onClick={() => handleRate('medium')}
                  className="py-3 rounded-2xl bg-[#d5e0f8] text-[#111c2d] text-xs font-bold hover:brightness-95 cursor-pointer"
                >
                  Médio
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="py-3 rounded-2xl bg-[#22c55e] text-white text-xs font-bold hover:brightness-95 cursor-pointer shadow-sm"
                >
                  Fácil
                </button>
              </div>
            ) : (
              <p className="text-center text-xs text-[#545f73]">Toque no cartão acima para revelar a resposta</p>
            )}
          </>
        ) : (
          /* Finished screen */
          <div className="text-center py-10 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-[#6d3bd7]/20 text-[#6d3bd7] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              🎉
            </div>
            <h3 className="font-headline-xl text-2xl font-bold text-[#0b1c30]">
              Revisão Concluída!
            </h3>
            <p className="text-xs text-[#545f73]">
              Você praticou {reviewedCount} flashcards. Seu ciclo de repetição foi atualizado.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#6d3bd7] text-white rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#5516be]"
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
