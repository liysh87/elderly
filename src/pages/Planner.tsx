import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '@/components/ChatBubble';
import { useChat } from '@/hooks/useChat';
import { usePlanStore } from '@/stores/planStore';
import { Send, ArrowLeft, FileText, RefreshCw, ChevronRight } from 'lucide-react';

export default function Planner() {
  const navigate = useNavigate();
  const { messages, loading, extractedParams, sendMessage, reset } = useChat();
  const { plan, planParams, setPlanParams, generatePlan, setPlan } = usePlanStore();
  const [input, setInput] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportTab, setReportTab] = useState<'savings' | 'investment' | 'insurance'>('savings');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-send first message
  useEffect(() => {
    if (!hasStarted.current && messages.length === 0) {
      hasStarted.current = true;
      const timer = setTimeout(() => {
        sendMessage('你好');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Update plan params from extracted params
  useEffect(() => {
    if (extractedParams) {
      setPlanParams(extractedParams);
    }
  }, [extractedParams]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  const handleGeneratePlan = async () => {
    await generatePlan();
    setShowReport(true);
  };

  const handleSendToSandbox = () => {
    navigate('/sandbox');
  };

  const handleScenario = async (scenario: 'delayRetirement' | 'increaseInvest' | 'reduceExpense') => {
    let newParams = { ...planParams };
    if (scenario === 'delayRetirement') {
      newParams.retirementAge += 5;
    } else if (scenario === 'increaseInvest') {
      newParams.annualIncome = Math.round(newParams.annualIncome * 1.2);
    } else if (scenario === 'reduceExpense') {
      newParams.monthlyExpense = Math.round(newParams.monthlyExpense * 0.8);
    }
    setPlanParams(newParams);
    await generatePlan();
  };

  const handleResetScenario = async () => {
    setPlanParams({
      age: 35,
      retirementAge: 60,
      totalAssets: 100000,
      annualIncome: 200000,
      monthlyExpense: 10000,
      riskPreference: 'moderate',
    });
    await generatePlan();
  };

  const formatWan = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(0) + '万';
    return n.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-amber-50">
          <ArrowLeft size={22} className="text-gray-600" />
        </button>
        <div>
          <h1 className="font-semibold text-gray-800">AI智能规划师</h1>
          <p className="text-xs text-gray-400">小安为您规划养老方案</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {/* Generate Plan Button */}
        {extractedParams && !showReport && (
          <div className="flex justify-center my-4">
            <button
              onClick={handleGeneratePlan}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-amber-200 transition-all flex items-center gap-2"
            >
              <FileText size={18} />
              生成方案
            </button>
          </div>
        )}

        {/* Report */}
        {showReport && plan && (
          <div className="mt-4 space-y-4">
            {/* Report Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-amber-100">
                {(['savings', 'investment', 'insurance'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setReportTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      reportTab === tab
                        ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                        : 'text-gray-500 hover:text-amber-600'
                    }`}
                  >
                    {tab === 'savings' ? '储蓄篇' : tab === 'investment' ? '投资篇' : '保险篇'}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-5">
                {reportTab === 'savings' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">到60岁需准备总养老金</p>
                      <p className="text-3xl font-bold text-amber-600 mt-1">
                        {formatWan(plan.savings.totalNeeded)}元
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-500">每月需定投</p>
                      <p className="text-2xl font-bold text-amber-700 mt-1">
                        {plan.savings.monthlyInvest.toLocaleString()}元
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      距离退休还有 {plan.savings.yearsToRetirement} 年
                    </p>
                  </div>
                )}

                {reportTab === 'investment' && (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-500">债券基金</p>
                        <p className="text-2xl font-bold text-blue-600">{plan.investment.bondRatio}%</p>
                      </div>
                      <div className="flex-1 bg-red-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-500">指数基金</p>
                        <p className="text-2xl font-bold text-red-500">{plan.investment.stockRatio}%</p>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500">预期年化收益</p>
                      <p className="text-2xl font-bold text-green-600">{plan.investment.expectedReturn}%</p>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{plan.investment.description}</p>
                  </div>
                )}

                {reportTab === 'insurance' && (
                  <div className="space-y-3">
                    {plan.insurance.map((ins, i) => (
                      <div key={i} className="bg-purple-50 rounded-xl p-4">
                        <p className="font-semibold text-purple-700 text-sm">{ins.type}</p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{ins.description}</p>
                      </div>
                    ))}
                    {plan.insurance.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">暂无特别保险建议</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scenarios */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">如果...会怎样？</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleScenario('delayRetirement')}
                  className="flex-1 min-w-[100px] bg-amber-50 hover:bg-amber-100 rounded-xl px-3 py-2 text-xs text-amber-700 transition-colors"
                >
                  <p className="font-medium">延迟退休5年</p>
                  <p className="mt-1">月投{plan.scenarios.delayRetirement.monthlyInvest.toLocaleString()}元</p>
                </button>
                <button
                  onClick={() => handleScenario('increaseInvest')}
                  className="flex-1 min-w-[100px] bg-green-50 hover:bg-green-100 rounded-xl px-3 py-2 text-xs text-green-700 transition-colors"
                >
                  <p className="font-medium">增加定投20%</p>
                  <p className="mt-1">月投{plan.scenarios.increaseInvest.monthlyInvest.toLocaleString()}元</p>
                </button>
                <button
                  onClick={() => handleScenario('reduceExpense')}
                  className="flex-1 min-w-[100px] bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2 text-xs text-blue-700 transition-colors"
                >
                  <p className="font-medium">降低预期开销</p>
                  <p className="mt-1">月投{plan.scenarios.reduceExpense.monthlyInvest.toLocaleString()}元</p>
                </button>
              </div>
              <button
                onClick={handleResetScenario}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-600 mt-3 mx-auto transition-colors"
              >
                <RefreshCw size={12} />
                恢复默认参数
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSendToSandbox}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2"
              >
                <BarChartIcon size={18} />
                送入沙盘推演
              </button>
              <button
                onClick={handleGeneratePlan}
                className="flex-1 bg-white border border-amber-200 hover:border-amber-400 text-amber-600 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                重新生成
              </button>
            </div>

            {/* Advisor CTA */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">需要更专业的建议？</p>
                <p className="text-xs text-gray-500">预约人工顾问，一对一深度规划</p>
              </div>
              <button className="bg-white border border-amber-300 text-amber-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors flex items-center gap-1">
                预约顾问 <ChevronRight size={14} />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 text-center pb-4">
              此为模拟推演，不构成投资建议
            </p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-amber-100 px-4 py-3 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入您的年龄、存款、退休计划..."
            className="flex-1 bg-amber-50 border border-amber-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-amber-300 placeholder-gray-400"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}