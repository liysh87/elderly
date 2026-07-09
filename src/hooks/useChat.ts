import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedParams, setExtractedParams] = useState<Record<string, any> | null>(null);

  const sendMessage = useCallback(async (message: string, dialect?: string) => {
    setLoading(true);
    const userMsg: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId, dialect }),
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      const aiMsg: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, aiMsg]);
      if (data.extractedParams) {
        setExtractedParams(data.extractedParams);
      }
      return data;
    } catch (e) {
      console.error('Chat error:', e);
      const errMsg: Message = { role: 'assistant', content: '抱歉，网络波动，请稍后再试。' };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const reset = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setExtractedParams(null);
  }, []);

  return { messages, loading, extractedParams, sendMessage, reset };
}