import { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceWaveProps {
  isListening: boolean;
  onToggle: () => void;
}

export default function VoiceWave({ isListening, onToggle }: VoiceWaveProps) {
  const [bars, setBars] = useState<number[]>(Array(5).fill(10));

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: 5 }, () => Math.random() * 30 + 5));
      }, 150);
      return () => clearInterval(interval);
    } else {
      setBars(Array(5).fill(5));
    }
  }, [isListening]);

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={onToggle}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
          isListening
            ? 'bg-amber-500 shadow-lg shadow-amber-200 scale-110'
            : 'bg-amber-100 hover:bg-amber-200'
        }`}
      >
        {isListening ? (
          <Mic size={48} className="text-white" />
        ) : (
          <MicOff size={48} className="text-amber-500" />
        )}
      </button>

      <div className="flex items-end gap-2 h-16">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-full bg-amber-500 transition-all duration-150"
            style={{ height: `${h}px`, opacity: isListening ? 0.8 : 0.3 }}
          />
        ))}
      </div>

      <p className="text-sm text-gray-500">
        {isListening ? '正在聆听...' : '点击按钮开始语音输入'}
      </p>
    </div>
  );
}