import { useState, useEffect, useCallback } from 'react';
import { usePetStore } from '@/stores/petStore';
import { Bell, X, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

const petEmojis: Record<string, string> = {
  deer: '🦌',
  fish: '🐟',
  cat: '🐱',
};

const idleActions = ['💤', '👀', '✨', '🌿'];

export default function PetWidget() {
  const {
    visible, mood, character, skin, hasNotification,
    briefingCard, briefingData, toggleBriefing, setCharacter, setSkin, setVisible
  } = usePetStore();

  const [idleAction, setIdleAction] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mood === 'idle') {
      const interval = setInterval(() => {
        setIdleAction((prev) => (prev + 1) % idleActions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mood]);

  const handleMouseDown = useCallback(() => {
    const timer = setTimeout(() => setShowMenu(true), 800);
    setLongPressTimer(timer);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Briefing Card */}
      {briefingCard && briefingData && (
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-4 w-72 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-amber-800 text-sm">{briefingData.title}</h3>
            <button onClick={toggleBriefing} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{briefingData.content}</p>
          <p className="text-xs text-gray-400 mt-2">{briefingData.time}</p>
        </div>
      )}

      {/* Context Menu */}
      {showMenu && (
        <div className="bg-white rounded-xl shadow-xl border border-amber-100 p-2 w-44 animate-in slide-in-from-bottom-2">
          <p className="text-xs text-gray-500 px-2 py-1">切换性格</p>
          <button
            onClick={() => { setCharacter('active'); setShowMenu(false); }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm ${character === 'active' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'}`}
          >
            🎉 活泼
          </button>
          <button
            onClick={() => { setCharacter('calm'); setShowMenu(false); }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm ${character === 'calm' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'}`}
          >
            🧘 沉稳
          </button>
          <hr className="my-1 border-gray-100" />
          <p className="text-xs text-gray-500 px-2 py-1">切换皮肤</p>
          {(['deer', 'fish', 'cat'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setSkin(s); setShowMenu(false); }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm ${skin === s ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'}`}
            >
              {petEmojis[s]} {s === 'deer' ? '小禄鹿' : s === 'fish' ? '金鱼' : '小猫'}
            </button>
          ))}
        </div>
      )}

      {/* Pet Button */}
      <button
        onClick={toggleBriefing}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 transition-all duration-300 relative ${
          mood === 'bouncing' ? 'animate-bounce border-amber-400 bg-amber-50' :
          mood === 'delivering' ? 'scale-110 border-amber-500 bg-amber-50' :
          'border-amber-200 bg-white/80 backdrop-blur hover:shadow-xl hover:scale-105'
        }`}
        style={{ animation: mood === 'idle' ? 'breathe 3s ease-in-out infinite' : undefined }}
      >
        <span className={mood === 'delivering' ? 'animate-pulse' : ''}>
          {mood === 'idle' ? idleActions[idleAction] : petEmojis[skin]}
        </span>
        {hasNotification && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <Bell size={10} className="text-white" />
          </span>
        )}
      </button>
    </div>
  );
}