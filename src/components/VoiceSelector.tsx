import React, { useMemo, useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import { Button } from './Button';

const SAMPLE_TEXT = 'This is a pronunciation test.';

export const VoiceSelector: React.FC = () => {
  const speech = useSpeech();

  // Guard against older hook shapes or voices not loaded yet
  const englishVoices = (speech as any).englishVoices ?? (speech.voices ?? []).filter((v: SpeechSynthesisVoice) =>
    (v.lang || '').toLowerCase().startsWith('en')
  );

  const selectedVoiceURI = (speech as any).selectedVoiceURI ?? null;
  const setSelectedVoice = (speech as any).setSelectedVoice ?? (() => {});
  const lastSelection = (speech as any).lastSelection ?? null;
  const speak = (speech as any).speak ?? (() => {});
  const cancel = (speech as any).cancel ?? (() => {});

  const [localSelection, setLocalSelection] = useState<string | null>(selectedVoiceURI || null);
  const [playingSample, setPlayingSample] = useState(false);

  useEffect(() => {
    // keep localSelection in sync if persisted selection changes elsewhere
    setLocalSelection(selectedVoiceURI || null);
  }, [selectedVoiceURI]);

  // Build display list from englishVoices
  const voiceOptions = useMemo(() => {
    return englishVoices.map((v: SpeechSynthesisVoice) => ({
      label: `${v.name} — ${v.lang}`,
      uri: v.voiceURI || v.name,
      name: v.name,
      lang: v.lang,
    }));
  }, [englishVoices]);

  const onPick = (uri: string | null) => {
    setLocalSelection(uri);
    setSelectedVoice(uri);
  };

  const playSample = (uri?: string | null) => {
    try {
      setPlayingSample(true);
      if (uri) {
        setSelectedVoice(uri);
      }
      // speak sample slightly slower to improve clarity
      speak(SAMPLE_TEXT, { lang: 'en-US', rate: 0.95 });
    } finally {
      setTimeout(() => setPlayingSample(false), 1000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-on-surface-variant" style={{ fontFamily: 'Quicksand' }}>
        English voice:
      </label>

      <select
        value={localSelection ?? ''}
        onChange={(e) => onPick(e.target.value || null)}
        className="px-3 py-1 rounded-lg bg-surface-container text-on-surface border border-outline"
        style={{ fontFamily: 'Quicksand' }}
      >
        <option value="">Auto (best English)</option>
        {voiceOptions.map((v) => (
          <option key={v.uri} value={v.uri}>
            {v.label}
          </option>
        ))}
      </select>

      <Button
        onClick={() => playSample(localSelection ?? selectedVoiceURI ?? undefined)}
        variant="secondary"
        size="sm"
        className="flex items-center gap-2"
      >
        ▶ Play
      </Button>

      <Button
        onClick={() => {
          setLocalSelection(null);
          setSelectedVoice(null);
        }}
        variant="tertiary"
        size="sm"
        className="flex items-center gap-2"
      >
        Auto
      </Button>

      <div className="text-xs text-on-surface-variant ml-2" style={{ fontFamily: 'Quicksand' }}>
        {lastSelection ? (
          <>
            <div>Using: {lastSelection.voice?.name ?? '—'} ({lastSelection.voice?.lang ?? '—'})</div>
            <div className="text-xs opacity-80">Reason: {lastSelection.reason}</div>
          </>
        ) : (
          <div className="opacity-80">No voice selected yet</div>
        )}
      </div>
    </div>
  );
};
