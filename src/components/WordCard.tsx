import React from 'react';
import { Word } from '../types/vocabulary';

interface WordCardProps {
  word: Word | null;
}

export const WordCard: React.FC<WordCardProps> = ({ word }) => {
  if (!word) {
    return (
      <div className="w-full max-w-2xl mx-auto px-gutter">
        <div className="bg-surface-container-lowest rounded-xl shadow-soft p-12 text-center">
          <p className="text-on-surface text-xl">
            🎉 Вітаємо! Ви завершили всі слова!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-gutter animate-slide-up">
      <div className="bg-surface-container-lowest rounded-xl shadow-soft p-12 text-center">
        <div className="text-6xl mb-8">
          {word.emoji || '📖'}
        </div>

        <div className="mb-6">
          <p className="text-on-surface-variant text-lg mb-2">
            What is this in English?
          </p>
          <p 
            className="text-primary font-bold text-5xl"
            style={{ fontFamily: 'Quicksand' }}
          >
            {word.ukrainian}
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="text-5xl">📚</div>
        </div>
      </div>
    </div>
  );
};
