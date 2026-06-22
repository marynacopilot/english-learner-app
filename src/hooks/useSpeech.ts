import { useSpeechContext } from '../context/SpeechProvider';
export default function useSpeech() {
  // simple wrapper so existing imports (useSpeech) keep working
  return useSpeechContext();
}
