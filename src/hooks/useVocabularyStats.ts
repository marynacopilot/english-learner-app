import { useState, useEffect, useCallback } from 'react';

interface VocabularyStats {
  learned: number;
  skipped: number;
}

const STATS_KEY = 'vocabulary_stats';

export const useVocabularyStats = (dictionaryName: string) => {
  const [stats, setStats] = useState<VocabularyStats>({ learned: 0, skipped: 0 });

  // Load stats from localStorage when dictionary changes
  useEffect(() => {
    const allStats = localStorage.getItem(STATS_KEY);
    if (allStats) {
      try {
        const parsedStats = JSON.parse(allStats);
        const dictionaryStats = parsedStats[dictionaryName] || { learned: 0, skipped: 0 };
        setStats(dictionaryStats);
      } catch (error) {
        console.error('Error loading stats from localStorage:', error);
        setStats({ learned: 0, skipped: 0 });
      }
    } else {
      setStats({ learned: 0, skipped: 0 });
    }
  }, [dictionaryName]);

  const updateStats = useCallback((learned: number, skipped: number) => {
    const newStats = { learned, skipped };
    setStats(newStats);

    // Save to localStorage
    const allStats = localStorage.getItem(STATS_KEY);
    let parsedStats = {};
    if (allStats) {
      try {
        parsedStats = JSON.parse(allStats);
      } catch (error) {
        console.error('Error parsing stats from localStorage:', error);
      }
    }

    parsedStats = {
      ...parsedStats,
      [dictionaryName]: newStats,
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(parsedStats));
  }, [dictionaryName]);

  const resetStats = useCallback(() => {
    const newStats = { learned: 0, skipped: 0 };
    setStats(newStats);

    // Update localStorage
    const allStats = localStorage.getItem(STATS_KEY);
    let parsedStats = {};
    if (allStats) {
      try {
        parsedStats = JSON.parse(allStats);
      } catch (error) {
        console.error('Error parsing stats from localStorage:', error);
      }
    }

    parsedStats = {
      ...parsedStats,
      [dictionaryName]: newStats,
    };

    localStorage.setItem(STATS_KEY, JSON.stringify(parsedStats));
  }, [dictionaryName]);

  return { stats, updateStats, resetStats };
};
