import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { usePetStore } from '@/stores/petStore';
import { usePlanStore } from '@/stores/planStore';
import PetWidget from '@/components/PetWidget';
import {
  TrendingUp, Wallet, PiggyBank, BarChart3,
  MessageCircle, Calculator, Mic, User, ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    const diff = value - display;
    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(display + diff * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [value]);

  return <span>{prefix}{display.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const { totalAssets, yesterdayReturn, yieldRate, monthlyChange, monthlyPension, pensionDate, fetchAssets } = useUserStore();
  const { setBriefingData, setNotification } = usePetStore();
  const { setPlanParams } = usePlanStore();

  useEffect(() => {
    fetchAssets();
    // Simulate pet briefing
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 9 && hour < 12) {
      setBriefingData({
        title: '今日市场速览',
        content: '养老产业指数上涨1.25%，您的养老金组合表现稳健。',
        time: '上午 9:30',
      });
    } else {
      setBriefingData({
        title: '今日收益日报',
        content: `今日预估收益+${yesterdayReturn.toFixed(2)}元，本月累计收益+856.30元。`,
        time: '下午 15:30',
      });
    }
    setNotification(true);
  }, []);

  const quickActions = [
    {
      icon: <MessageCircle size={28} />,
      label: 'AI规划师',
      desc: '智能养老规划',
      color: 'bg-amber-50 text-amber-600',
      path: '/planner',
    },
    {
      icon: <Calculator size={28} />,
      label: '退休沙盘',
      desc: '可视化推演',
      color: 'bg-emerald-50 text-emerald-600',
      path: '/sandbox',
    },
    {
      icon: <Mic size={28} />,
      label: '语音管家',
      desc: '语音查余额',
      color: 'bg-blue-50 text-blue-600',
      path: '/voice',
    },
    {
      icon: <User size={28} />,
      label: '我的',
      desc: '个人中心',
      color: 'bg-purple-50 text-purple-600',
      path: '/profile',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-6 py-8 rounded-b-[2.5rem] shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-wide">安颐伴</h1>
              <p className="text-amber-100 text-sm mt-1">您的AI养老管家</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Eye size={22} />
            </div>
          </div>

          {/* Asset Card */}
          <div className="bg-white/15 backdrop-blur rounded-2xl p-5 border border-white/20">
            <p className="text-amber-100 text-sm mb-1">总资产（元）</p>
            <p className="text-3xl font-bold mb-3">
              <AnimatedNumber value={totalAssets} />
            </p>
            <div className="flex gap-6">
              <div>
                <p className="text-amber-100 text-xs">昨日收益</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <ArrowUpRight size={14} className="text-green-300" />
                  +{yesterdayReturn.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-amber-100 text-xs">持有收益率</p>
                <p className="text-sm font-semibold">{yieldRate}%</p>
              </div>
              <div>
                <p className="text-amber-100 text-xs">本月变化</p>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <ArrowUpRight size={14} className="text-green-300" />
                  +{monthlyChange}%
                </p>
              </div>
            </div>
          </div>

          {/* Pension Info */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-white/10 rounded-xl p-3 flex items-center gap-3">
              <Wallet size={20} className="text-amber-200" />
              <div>
                <p className="text-xs text-amber-100">本月养老金</p>
                <p className="font-semibold">{monthlyPension.toFixed(2)}元</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 flex items-center gap-3">
              <TrendingUp size={20} className="text-amber-200" />
              <div>
                <p className="text-xs text-amber-100">到账日期</p>
                <p className="font-semibold">{pensionDate}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <main className="max-w-4xl mx-auto px-6 -mt-4 relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                if (action.path === '/sandbox') {
                  setPlanParams({
                    age: 35,
                    retirementAge: 60,
                    totalAssets: 100000,
                    annualIncome: 200000,
                    monthlyExpense: 10000,
                    riskPreference: 'moderate',
                  });
                }
                navigate(action.path);
              }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md hover:border-amber-100 transition-all duration-300 text-left group"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-[15px]">{action.label}</h3>
              <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-24">
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">风险提示：</span>
            此为模拟推演，不构成投资建议。投资有风险，入市需谨慎。保险推荐仅限产品类型，不涉及具体产品销售。
          </p>
        </div>
      </main>

      {/* Pet Widget */}
      <PetWidget />
    </div>
  );
}