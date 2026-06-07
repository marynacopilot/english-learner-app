import { useState, useCallback, useEffect } from 'react';
import { Word, VocabularyState } from '../types/vocabulary';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getNextWord = (
  availableWords: Word[],
  skippedWords: Word[],
  useSkippedWordsMode: boolean
): Word | null => {
  if (useSkippedWordsMode && skippedWords.length > 0) {
    return skippedWords[Math.floor(Math.random() * skippedWords.length)];
  }
  if (availableWords.length > 0) {
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  }
  return null;
};

export const useVocabulary = (initialWords: Word[]) => {
  const [state, setState] = useState<VocabularyState>({
    allWords: initialWords,
    currentWord: null,
    availableWords: shuffleArray(initialWords),
    skippedWords: [],
    learnedWords: [],
    userInput: '',
    showSuccess: false,
    showSkippedModal: false,
    useSkippedWordsMode: false,
  });

  useEffect(() => {
    if (state.currentWord === null && state.availableWords.length > 0) {
      const firstWord = getNextWord(
        state.availableWords,
        state.skippedWords,
        state.useSkippedWordsMode
      );
      if (firstWord) {
        setState(prev => ({ ...prev, currentWord: firstWord }));
      }
    }
  }, []);

  const checkAnswer = useCallback((answer: string) => {
    if (!state.currentWord) return false;
    const isCorrect = answer.toLowerCase().trim() === 
                      state.currentWord.english.toLowerCase().trim();
    if (isCorrect) {
      handleCorrectAnswer();
    }
    return isCorrect;
  }, [state.currentWord]);

  const handleCorrectAnswer = useCallback(() => {
    if (!state.currentWord) return;
    setState(prev => {
      const newLearned = [...prev.learnedWords, prev.currentWord!];
      let newAvailable = prev.availableWords.filter(w => w.id !== prev.currentWord!.id);
      let newSkipped = prev.skippedWords.filter(w => w.id !== prev.currentWord!.id);
      const nextWord = getNextWord(newAvailable, newSkipped, prev.useSkippedWordsMode);
      return {
        ...prev,
        learnedWords: newLearned,
        availableWords: newAvailable,
        skippedWords: newSkipped,
        currentWord: nextWord,
        userInput: '',
        showSuccess: true,
      };
    });
    setTimeout(() => {
      setState(prev => ({ ...prev, showSuccess: false }));
    }, 2500);
  }, []);

  const skipWord = useCallback(() => {
    if (!state.currentWord) return;
    setState(prev => {
      const isAlreadySkipped = prev.skippedWords.some(w => w.id === prev.currentWord!.id);
      const newSkipped = isAlreadySkipped ? prev.skippedWords : [...prev.skippedWords, prev.currentWord!];
      const newAvailable = prev.availableWords.filter(w => w.id !== prev.currentWord!.id);
      const nextWord = getNextWord(newAvailable, newSkipped, prev.useSkippedWordsMode);
      return {
        ...prev,
        skippedWords: newSkipped,
        availableWords: newAvailable,
        currentWord: nextWord,
        userInput: '',
      };
    });
  }, []);

  const toggleSkippedWordsMode = useCallback(() => {
    setState(prev => {
      const newMode = !prev.useSkippedWordsMode;
      if (newMode && prev.skippedWords.length === 0) return prev;
      const nextWord = getNextWord(prev.availableWords, prev.skippedWords, newMode);
      return {
        ...prev,
        useSkippedWordsMode: newMode,
        currentWord: nextWord || prev.currentWord,
        userInput: '',
      };
    });
  }, []);

  const openSkippedModal = useCallback(() => {
    setState(prev => ({ ...prev, showSkippedModal: true }));
  }, []);

  const closeSkippedModal = useCallback(() => {
    setState(prev => ({ ...prev, showSkippedModal: false }));
  }, []);

  const updateInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, userInput: value }));
  }, []);

  const getStats = useCallback(() => {
    return {
      learned: state.learnedWords.length,
      skipped: state.skippedWords.length,
    };
  }, [state.learnedWords.length, state.skippedWords.length]);

  return {
    state,
    checkAnswer,
    skipWord,
    toggleSkippedWordsMode,
    openSkippedModal,
    closeSkippedModal,
    updateInput,
    getStats,
  };
};
