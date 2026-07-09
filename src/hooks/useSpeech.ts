import { useState, useCallback, useRef, useEffect } from 'react';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setError('您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器');
      return;
    }

    setError(null);
    setIsListening(true);
    setTranscript('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      switch (event.error) {
        case 'not-allowed':
          setError('请允许麦克风权限以使用语音功能');
          break;
        case 'no-speech':
          setError('未检测到语音，请重试');
          break;
        case 'network':
          setError('网络错误，请检查网络连接');
          break;
        case 'service-not-allowed':
          setError('语音服务不可用，请稍后重试');
          break;
        default:
          setError(`语音识别错误: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      setError('无法启动语音识别');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string, dialect?: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = dialect === 'cantonese' ? 'zh-HK' : 'zh-CN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      setError('您的浏览器不支持语音合成');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    isSpeaking,
    error,
    startListening,
    stopListening,
    speak,
    clearError,
  };
}