import { useState, useCallback, useRef } from 'react';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    // Simulate speech recognition for demo
    // In production, use Web Speech API or a third-party service
    setIsListening(true);
    setTranscript('');

    // Mock: after 3 seconds, simulate recognizing text
    setTimeout(() => {
      setIsListening(false);
      const mockTexts = [
        '查余额',
        '看收益',
        '看持有',
        '有没有稳当点的？',
        '修改定投金额',
      ];
      setTranscript(mockTexts[Math.floor(Math.random() * mockTexts.length)]);
    }, 3000);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string, dialect?: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = dialect === 'cantonese' ? 'zh-HK' : 'zh-CN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  return { isListening, transcript, isSpeaking, startListening, stopListening, speak };
}