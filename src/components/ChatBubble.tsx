import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  time?: string;
}

export default function ChatBubble({ role, content, time }: ChatBubbleProps) {
  const isAI = role === 'assistant';

  return (
    <div className={`flex gap-3 mb-4 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAI ? 'bg-amber-100 text-amber-600' : 'bg-amber-500 text-white'
      }`}>
        {isAI ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className={`max-w-[75%] ${isAI ? '' : 'items-end flex flex-col'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isAI
            ? 'bg-white border border-amber-100 text-gray-700 rounded-tl-sm'
            : 'bg-amber-500 text-white rounded-tr-sm'
        }`}>
          <span className="text-[15px]">{content}</span>
        </div>
        {time && (
          <span className="text-xs text-gray-400 mt-1 px-2">{time}</span>
        )}
      </div>
    </div>
  );
}