import React from 'react';
import { Word } from '../types/vocabulary';

interface SkippedWordsListProps {
  words: Word[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const SkippedWordsList: React.FC<SkippedWordsListProps> = ({
  words,
  isOpen,
  onClose,
  title = 'My Skipped Words',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-gutter">
      <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-soft-lg animate-slide-up">
        {/* Header */}
        <div className="bg-primary-fixed p-6 flex items-center justify-between border-b-2 border-primary">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h2 
                className="text-lg font-bold text-on-surface"
                style={{ fontFamily: 'Quicksand' }}
              >
                {title}
              </h2>
            </div>
          </div>
          <span className="bg-secondary-fixed px-3 py-1 rounded-full text-sm font-bold text-on-surface">
            {words.length} words
          </span>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {words.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-on-surface-variant text-lg">
                No skipped words yet! 🎉
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {words.map((word) => (
                <div 
                  key={word.id} 
                  className="p-4 hover:bg-surface-container transition-colors"
                >
                  <p className="text-on-surface-variant text-xs mb-1">Ukrainian</p>
                  <p className="text-on-surface font-bold text-lg">
                    {word.emoji ? `${word.emoji} ` : ''}{word.ukrainian}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface-container-high p-4 border-t-2 border-outline-variant">
          <button
            onClick={onClose}
            className="
              w-full px-4 py-3 rounded-base bg-primary text-on-primary font-bold
              hover:bg-primary-container transition-colors
              active:translate-y-0.5
            "
            style={{ fontFamily: 'Quicksand' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
