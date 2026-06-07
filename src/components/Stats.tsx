import React from 'react';

interface StatsProps {
  learned: number;
  skipped: number;
  onLearnedClick?: () => void;
  onSkippedClick?: () => void;
}

export const Stats: React.FC<StatsProps> = ({
  learned,
  skipped,
  onLearnedClick,
  onSkippedClick,
}) => {
  return (
    <div className="flex gap-3 justify-end items-center">
      <button
        onClick={onLearnedClick}
        className="
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-success/20 border-2 border-success
          hover:bg-success/30 transition-colors
          cursor-pointer
        "
      >
        <span className="text-lg">✓</span>
        <span className="text-on-surface font-bold">
          Learned: {learned}
        </span>
      </button>

      <button
        onClick={onSkippedClick}
        className="
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-tertiary-fixed/30 border-2 border-tertiary-fixed-dim
          hover:bg-tertiary-fixed/50 transition-colors
          cursor-pointer
        "
      >
        <span className="text-lg">⏩</span>
        <span className="text-on-surface font-bold">
          Skipped: {skipped}
        </span>
      </button>
    </div>
  );
};
