import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useSpeech } from '@/hooks/useSpeech';
import VoiceWave from '@/components/VoiceWave';
import ChatBubble from '@/components/ChatBubble';
import {
  ArrowLeft, Phone, Wallet, TrendingUp, PieChart,
  Send, Shield, AlertTriangle, XCircle, X
} from 'lucide-react';

type VoiceMode = 'idle' | 'listening' | 'result';

export default function Voice() {
  const navigate = useNavigate();
  const { totalAssets, monthlyPension, pensionDate, yesterdayReturn, yieldRate, monthlyChange, holdings, fetchHoldings } = useUserStore();
  const { isListening, transcript, startListening, stopListening, speak, error, clearError } = useSpeech();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('idle');
  const [showRecommendation, setShowRecommendation] = useState(false);

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setVoiceMode('idle');
    } else {
      startListening();
      setVoiceMode('listening');
    }
  };

  // Process transcript when it changes
  useEffect(() => {
    if (transcript && !isListening) {
      setVoiceMode('result');
      processCommand(transcript);
    }
  }, [transcript, isListening]);

  const processCommand = (cmd: string) => {
    const userMsg = cmd;
    let reply = '';

    if (cmd.includes('查余额') || cmd.includes('余额')) {
      setMessages((prev) => [...prev, { role: 'user', content: cmd }]);
      reply = `您的总资产为${(totalAssets / 10000).toFixed(2)}万元，本月养老金${monthlyPension}元，已于${pensionDate}到账。`;
    } else if (cmd.includes('看收益') || cmd.includes('收益')) {
      setMessages((prev) => [...prev, { role: 'user', content: cmd }]);
      reply = `昨日收益+${yesterdayReturn.toFixed(2)}元，持有收益率${yieldRate}%，近一月涨跌${monthlyChange > 0 ? '+' : ''}${monthlyChange}%。`;
    } else if (cmd.includes('看持有') || cmd.includes('持有')) {
      setMessages((prev) => [...prev, { role: 'user', content: cmd }]);
      if (holdings.length > 0) {
        reply = '您当前持有以下产品：\n' + holdings.map(h => `${h.name}，市值${(h.marketValue / 10000).toFixed(1)}万，收益率${h.returnRate > 0 ? '+' : ''}${h.returnRate}%`).join('\n');
      } else {
        reply = '您当前暂未持有任何产品。';
      }
    } else if (cmd.includes('稳当') || cmd.includes('稳健') || cmd.includes('有没有')) {
      setMessages((prev) => [...prev, { role: 'user', content: cmd }]);
      reply = '您这笔钱打算多久后用呢？如果是短期（1年内），建议选择货币基金；如果是长期（3年以上），可以考虑纯债基金。';
      setShowRecommendation(true);
    } else if (cmd.includes('修改定投') || cmd.includes('定投金额')) {
      setMessages((prev) => [...prev, { role: 'user', content: cmd }]);
      reply = '好的，请告诉我您想修改定投金额为多少？（例如：改为每月3000元）';
    } else {
      setMessages((prev) => [...prev, { role: 'user', content: cmd }]);
      reply = '您可以用以下方式查询：\n• "查余额" - 查看总资产\n• "看收益" - 查看收益情况\n• "看持有" - 查看持有产品\n• "有没有稳当点的？" - 稳健产品推荐';
    }

    if (reply) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        speak(reply);
      }, 500);
    }
  };

  const handleRecommendation = (term: 'short' | 'long') => {
    const reply = term === 'short'
      ? '建议选择安颐货币基金（R1级），这个产品风险极低，历史看几乎没亏过，流动性好，随时可取。七日年化收益率约2.1%。'
      : '建议选择安颐纯债债券A（R2级），主要投资国债和企业债，历史看最大回撤不到1%，近一年收益率3.2%。比存款收益高一些，波动也不大。';
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    speak(reply);
    setShowRecommendation(false);
  };

  const quickCommands = [
    { label: '查余额', icon: <Wallet size={16} />, cmd: '查余额' },
    { label: '看收益', icon: <TrendingUp size={16} />, cmd: '看收益' },
    { label: '看持有', icon: <PieChart size={16} />, cmd: '看持有' },
    { label: '稳健推荐', icon: <Shield size={16} />, cmd: '有没有稳当点的？' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {error && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-amber-50">
            <ArrowLeft size={22} className="text-gray-600" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-800">语音管家</h1>
            <p className="text-xs text-gray-400">说话就能查余额、听收益</p>
          </div>
        </div>
        <button
          className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-lg shadow-green-200"
        >
          <Phone size={20} className="text-white" />
        </button>
      </header>

      {/* Voice Mode */}
      {voiceMode === 'listening' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white">
          <VoiceWave isListening={true} onToggle={handleVoiceToggle} />
        </div>
      )}

      {/* Chat Mode */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        {messages.length === 0 && voiceMode !== 'listening' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Phone size={36} className="text-amber-500" />
            </div>
            <p className="text-gray-500 text-sm">点击下方绿色按钮，用语音查询</p>
            <p className="text-gray-400 text-xs mt-2">或直接选择快捷指令</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {/* Recommendation options */}
        {showRecommendation && (
          <div className="flex gap-3 my-3 justify-center">
            <button
              onClick={() => handleRecommendation('short')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              短期（1年内）
            </button>
            <button
              onClick={() => handleRecommendation('long')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              长期（3年以上）
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-white border-t border-amber-100 px-4 py-4 sticky bottom-0">
        {/* Quick Commands */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 max-w-2xl mx-auto">
          {quickCommands.map((qc, i) => (
            <button
              key={i}
              onClick={() => processCommand(qc.cmd)}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-full px-4 py-2 text-xs text-amber-700 whitespace-nowrap transition-colors flex-shrink-0"
            >
              {qc.icon}
              {qc.label}
            </button>
          ))}
        </div>

        {/* Voice Button */}
        <div className="flex justify-center">
          <button
            onClick={handleVoiceToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200 scale-110'
                : 'bg-green-500 hover:bg-green-600 shadow-green-200'
            }`}
          >
            <Phone size={28} className="text-white" />
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border-t border-amber-100 px-4 py-2 flex items-center justify-center gap-1.5">
        <AlertTriangle size={12} className="text-amber-500" />
        <p className="text-[10px] text-amber-600">涉及资金变动的操作需二次验证</p>
      </div>
    </div>
  );
}