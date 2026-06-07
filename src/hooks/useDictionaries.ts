import { useState, useEffect } from 'react';
import { Word } from '../types/vocabulary';

export interface DictionaryInfo {
  name: string;
  path: string;
  words: Word[];
}

const loadDictionaries = async (): Promise<Map<string, Word[]>> => {
  const dictionaries = new Map<string, Word[]>();
  
  try {
    // Завантажуємо основний словник
    const wordsModule = await import('../data/words.json');
    const wordsData = Array.isArray(wordsModule.default) ? wordsModule.default : wordsModule;
    dictionaries.set('words', wordsData);
    
    // Спробуємо завантажити додаткові словники з папки data
    // Динамічно шукаємо всі .json файли в data папці
    const dataContext = (import.meta as any).glob?.('/src/data/*.json', { eager: true });
    
    if (dataContext) {
      Object.entries(dataContext).forEach(([path, module]: [string, any]) => {
        const fileName = path.split('/').pop()?.replace('.json', '') || '';
        if (fileName && fileName !== 'words') {
          const data = Array.isArray(module.default) ? module.default : module;
          if (Array.isArray(data)) {
            dictionaries.set(fileName, data);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error loading dictionaries:', error);
    // Повертаємо хоча б основний словник
    try {
      const wordsModule = await import('../data/words.json');
      const wordsData = Array.isArray(wordsModule.default) ? wordsModule.default : wordsModule;
      dictionaries.set('words', wordsData);
    } catch (e) {
      console.error('Failed to load default dictionary:', e);
    }
  }
  
  return dictionaries;
};

export const useDictionaries = () => {
  const [dictionaries, setDictionaries] = useState<Map<string, Word[]>>(new Map());
  const [selectedDictionary, setSelectedDictionary] = useState<string>('words');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAsync = async () => {
      setIsLoading(true);
      try {
        const dicts = await loadDictionaries();
        setDictionaries(dicts);
        
        // Завантажуємо вибір зі localStorage
        const savedDict = localStorage.getItem('selectedDictionary');
        if (savedDict && dicts.has(savedDict)) {
          setSelectedDictionary(savedDict);
        } else if (dicts.size > 0) {
          // Встановлюємо першу доступну словник
          const firstKey = Array.from(dicts.keys())[0];
          setSelectedDictionary(firstKey);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAsync();
  }, []);

  const switchDictionary = (name: string) => {
    if (dictionaries.has(name)) {
      setSelectedDictionary(name);
      localStorage.setItem('selectedDictionary', name);
    }
  };

  const getCurrentDictionary = (): Word[] => {
    return dictionaries.get(selectedDictionary) || [];
  };

  const getDictionaryList = (): string[] => {
    return Array.from(dictionaries.keys());
  };

  return {
    dictionaries,
    selectedDictionary,
    isLoading,
    switchDictionary,
    getCurrentDictionary,
    getDictionaryList,
  };
};
