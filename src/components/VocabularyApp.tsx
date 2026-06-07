import React from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import { Word } from '../types/vocabulary';
import { WordCard } from './WordCard';
import { InputField } from './InputField';
import { Button } from './Button';
import { Stats } from './Stats';
import { SuccessNotification } from './SuccessNotification';
import { SkippedWordsList } from './SkippedWordsList';
import { Toggle } from './Toggle';

interface VocabularyAppProps {
  words: Word[];
}

export const VocabularyApp: React.FC<VocabularyAppProps> = ({ words }) => {
  const {
    state,
    checkAnswer,
    skipWord,
    toggleSkippedWordsMode,
    openSkippedModal,
    closeSkippedModal,
    updateInput,
    getStats,
  } = useVocabulary(words);

  const stats = getStats();

  const handleSubmit = () => {
    checkAnswer(state.userInput);
  };

  const isGameOver = 
    !state.currentWord && 
    state.availableWords.length === 0 && 
    state.skippedWords.length === 0;

  const canToggleSkippedMode = state.skippedWords.length > 0;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-container-low p-6 shadow-soft">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 
            className="text-3xl font-bold text-primary"
            style={{ fontFamily: 'Quicksand' }}
          >
            English Fun
          </h1>
          <Stats 
            learned={stats.learned}
            skipped={stats.skipped}
            onLearnedClick={openSkippedModal}
            onSkippedClick={openSkippedModal}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-gutter py-12">
        <div className="space-y-8">
          {/* Word Card */}
          <WordCard word={state.currentWord} />

          {/* Input and Controls */}
          {!isGameOver && state.currentWord && (
            <div className="space-y-6">
              {/* Input Field */}
              <InputField
                value={state.userInput}
                onChange={updateInput}
                onSubmit={handleSubmit}
                placeholder="Type English here..."
                disabled={state.showSuccess}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center max-w-2xl mx-auto px-gutter">
                <Button
                  onClick={handleSubmit}
                  disabled={state.showSuccess}
                  variant="primary"
                >
                  Check
                </Button>
                <Button
                  onClick={skipWord}
                  disabled={state.showSuccess}
                  variant="secondary"
                >
                  ⏩ Skip
                </Button>
              </div>

              {/* Repeat Skipped Words Toggle */}
              {canToggleSkippedMode && (
                <div className="max-w-2xl mx-auto px-gutter flex justify-center">
                  <Toggle
                    enabled={state.useSkippedWordsMode}
                    onChange={toggleSkippedWordsMode}
                    label="Repeat skipped words"
                    disabled={state.showSuccess}
                  />
                </div>
              )}
            </div>
          )}

          {/* Game Over Message */}
          {isGameOver && (
            <div className="text-center">
              <p className="text-3xl mb-6">🎉</p>
              <p 
                className="text-2xl font-bold text-primary mb-4"
                style={{ fontFamily: 'Quicksand' }}
              >
                Congratulations!
              </p>
              <p className="text-on-surface-variant text-lg">
                You learned all {stats.learned} words!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Success Notification */}
      <SuccessNotification show={state.showSuccess} />

      {/* Skipped Words Modal */}
      <SkippedWordsList
        words={state.skippedWords}
        isOpen={state.showSkippedModal}
        onClose={closeSkippedModal}
        title="My Skipped Words"
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-low border-t-2 border-outline-variant py-4">
        <div className="max-w-4xl mx-auto px-gutter flex items-center justify-center gap-8">
          <button className="flex flex-col items-center gap-1 text-primary hover:text-primary-container transition-colors">
            <span className="text-2xl">▶️</span>
            <span className="text-xs font-bold">Play</span>
          </button>
          <button 
            onClick={openSkippedModal}
            className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="text-2xl">📊</span>
            <span className="text-xs font-bold">Progress</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <span className="text-2xl">⚙️</span>
            <span className="text-xs font-bold">Settings</span>
          </button>
        </div>
      </nav>

      {/* Padding for bottom nav */}
      <div className="h-24"></div>
    </div>
  );
};
