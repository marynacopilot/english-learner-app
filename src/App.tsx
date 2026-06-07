import React, { useState } from 'react';
import { VocabularyApp } from './components/VocabularyApp';
import { DictionarySelector } from './components/DictionarySelector';
import { Stats } from './components/Stats';
import { useDictionaries } from './hooks/useDictionaries';
import './index.css';

function App() {
  const { selectedDictionary, isLoading, switchDictionary, getCurrentDictionary, getDictionaryList } = useDictionaries();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'learned' | 'skipped'>('learned');
  const [key, setKey] = useState(0);

  const handleDictionaryChange = (newDict: string) => {
    switchDictionary(newDict);
    // Перезавантажуємо VocabularyApp компонент
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
      {/* Header з селектором і статистикою */}
      <header className="bg-surface-container-low p-4 shadow-soft flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Dictionary Selector */}
            {dictionaryList.length > 1 && (
              <div className="flex-1 min-w-max">
                <label 
                  className="text-sm font-medium text-on-surface-variant block mb-2"
                  style={{ fontFamily: 'Quicksand' }}
                >
                  Виберіть словник:
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
            <Stats 
              learned={0}
              skipped={0}
              onLearnedClick={handleLearnedClick}
              onSkippedClick={handleSkippedClick}
            />
          </div>
        </div>
      </header>

      {currentWords.length > 0 && (
        <VocabularyApp key={key} words={currentWords} />
      )}
    </div>
  );
}

export default App;
