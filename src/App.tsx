import React from 'react';
import { VocabularyApp } from './components/VocabularyApp';
import { useDictionaries } from './hooks/useDictionaries';
import { Button } from './components/Button';
import { VoiceSelector } from './components/VoiceSelector';

import './index.css';

function App() {
  const { selectedDictionary, isLoading, switchDictionary, getCurrentDictionary, getDictionaryList } = useDictionaries();
  const [key, setKey] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState<'learned' | 'skipped'>('learned');
  const [stats, setStats] = React.useState({ learned: 0, skipped: 0 });

  const handleDictionaryChange = (newDict: string) => {
    switchDictionary(newDict);
    setKey(prev => prev + 1);
  };

  const handleLearnedClick = () => {
    setModalType('learned');
    setShowModal(true);
  };

  const handleSkippedClick = () => {
    setModalType('skipped');
    setShowModal(true);
  };

  const handleStatsUpdate = (learned: number, skipped: number) => {
    setStats({ learned, skipped });
  };

const handleResetVocabulary = () => {
  // Clear localStorage for current vocabulary
  const currentWords = getCurrentDictionary();
  if (currentWords.length > 0) {
    const key = `vocabulary_data_${currentWords.map(w => w.id).sort().join('|')}`;
    localStorage.removeItem(key);
  }
  setStats({ learned: 0, skipped: 0 });
  setKey(prev => prev + 1);
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl mb-4">📚</p>
          <p className="text-lg text-on-surface-variant" style={{ fontFamily: 'Quicksand' }}>
            Завантаження словників...
          </p>
        </div>
      </div>
    );
  }

  const currentWords = getCurrentDictionary();
  const dictionaryList = getDictionaryList();

  return (
    <div className="App">
      {/* Header з селектором словників і статистикою */}
      
      <header className="bg-surface-container-low p-4 shadow-soft flex-shrink-0">
        <div className="flex items-center gap-4">
  {/* existing dictionary selector */}
  <VoiceSelector />
  {/* rest of header */}
</div>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Dictionary Selector */}
            {dictionaryList.length > 1 && (
              <div>
                <label 
                  className="text-sm font-medium text-on-surface-variant block mb-2"
                  style={{ fontFamily: 'Quicksand' }}
                >
                  Choose dictionary:
                </label>
                <div className="flex flex-wrap gap-2">
                  {dictionaryList.map((dict) => (
                    <button
                      key={dict}
                      onClick={() => handleDictionaryChange(dict)}
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium transition-all
                        ${selectedDictionary === dict
                          ? 'bg-primary text-on-primary shadow-soft'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }
                      `}
                      style={{ fontFamily: 'Quicksand' }}
                    >
                      {dict}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stats Buttons */}
<div className="flex gap-3 justify-end items-center flex-wrap">
  <Button
    onClick={handleLearnedClick}
    variant="primary"
    size="md"
    className="flex items-center gap-2 text-white"
  >
    <span className="text-lg">✓</span>
    <span className="font-bold">Learned: {stats.learned}</span>
  </Button>

  <Button
    onClick={handleSkippedClick}
    variant="secondary"
    size="md"
    className="flex items-center gap-2 text-white"
  >
    <span className="font-bold">Skipped: {stats.skipped}</span>
  </Button>

  {/* Reset: keep a lighter appearance than Skipped by overriding the background and using a less-contrasting text */}
  <Button
    onClick={handleResetVocabulary}
    variant="secondary"
    size="md"
    className="flex items-center gap-2 bg-secondary-fixed/20 text-on-surface"
  >
    Reset
  </Button>
</div>
          </div>
        </div>
      </header>

{currentWords.length > 0 && (
  <VocabularyApp 
    key={key} 
    words={currentWords}
    learnedWords={[]}
    skippedWords={[]}
    onStatsUpdate={handleStatsUpdate}
    onLearnedClick={handleLearnedClick}
    onSkippedClick={handleSkippedClick}
    showModal={showModal}
    setShowModal={setShowModal}
    modalType={modalType}
    setModalType={setModalType}
    resetVocabularyCallback={handleResetVocabulary}
  />
)}
    </div>
  );
}

export default App;
