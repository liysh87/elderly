import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '@/stores/planStore';
import { ArrowLeft, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, ComposedChart
} from 'recharts';

export default function Sandbox() {
  const navigate = useNavigate();
  const { plan, planParams } = usePlanStore();

  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [annualReturn, setAnnualReturn] = useState(5);
  const [monthlyExpense, setMonthlyExpense] = useState(10000);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyInvest, setMonthlyInvest] = useState(2000);

  useEffect(() => {
    if (plan) {
      setRetirementAge(planParams.retirementAge);
      setMonthlyInvest(plan.savings.monthlyInvest);
      setMonthlyExpense(planParams.monthlyExpense);
      setAnnualReturn(plan.investment.expectedReturn);
    }
  }, [plan, planParams]);

  // Generate projection data
  const projectionData = useMemo(() => {
    const data: { age: number; asset: number; isRetired: boolean }[] = [];
    let asset = planParams.totalAssets || 100000;
    const monthlyRate = annualReturn / 100 / 12;
    let currentAge = planParams.age || 35;

    while (currentAge <= lifeExpectancy) {
      const isRetired = currentAge >= retirementAge;
      if (isRetired) {
        asset = asset * (1 + monthlyRate) - monthlyExpense;
      } else {
        asset = asset * (1 + monthlyRate) + monthlyInvest;
      }
      data.push({
        age: currentAge,
        asset: Math.round(asset * 100) / 100,
        isRetired,
      });
      currentAge++;
    }
    return data;
  }, [lifeExpectancy, annualReturn, monthlyExpense, retirementAge, monthlyInvest, planParams]);

  const ruinAge = useMemo(() => {
    for (const d of projectionData) {
      if (d.asset <= 0) return d.age;
    }
    return null;
  }, [projectionData]);

  const finalAsset = projectionData[projectionData.length - 1]?.asset || 0;
  const peakAsset = useMemo(() => {
    return Math.max(...projectionData.map(d => d.asset));
  }, [projectionData]);

  const formatWan = (n: number) => {
    if (Math.abs(n) >= 10000) return (n / 10000).toFixed(1) + '万';
    return n.toFixed(0);
  };

  const formatAxis = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(0) + '万';
    return n.toString();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-amber-50">
          <ArrowLeft size={22} className="text-gray-600" />
        </button>
        <div>
          <h1 className="font-semibold text-gray-800">动态退休沙盘</h1>
          <p className="text-xs text-gray-400">可视化退休资产推演</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">资产变化曲线</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projectionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" strokeOpacity={0.5} />
                <XAxis
                  dataKey="age"
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: '年龄', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#9CA3AF' }}
                />
                <YAxis
                  tickFormatter={formatAxis}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [formatWan(value) + '元', '总资产']}
                  labelFormatter={(label) => `${label}岁`}
                  contentStyle={{ borderRadius: 12, border: '1px solid #FDE68A', fontSize: 13 }}
                />
                <ReferenceLine
                  x={retirementAge}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: '退休', position: 'top', fontSize: 11, fill: '#F59E0B' }}
                />
                <ReferenceLine y={0} stroke="#EF4444" strokeWidth={1} strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="asset"
                  stroke={ruinAge ? '#EF4444' : '#10B981'}
                  fill={ruinAge ? 'url(#colorRisk)' : 'url(#colorAsset)'}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Warning */}
          {ruinAge && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">资金耗尽警告</p>
                <p className="text-xs text-red-600 mt-1">
                  按当前计划，您<strong>{ruinAge}岁</strong>时资金将耗尽，建议调整上方参数。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-50 text-center">
            <p className="text-xs text-gray-400">峰值资产</p>
            <p className="text-lg font-bold text-green-600 mt-1">{formatWan(peakAsset)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-50 text-center">
            <p className="text-xs text-gray-400">最终资产</p>
            <p className={`text-lg font-bold mt-1 ${finalAsset > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatWan(finalAsset)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-50 text-center">
            <p className="text-xs text-gray-400">资金耗尽</p>
            <p className={`text-lg font-bold mt-1 ${ruinAge ? 'text-red-500' : 'text-green-600'}`}>
              {ruinAge ? ruinAge + '岁' : '安全'}
            </p>
          </div>
        </div>

        {/* Sliders */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 space-y-6">
          <h3 className="text-sm font-semibold text-gray-700">调整参数</h3>

          {/* Life Expectancy */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-500">预期寿命</label>
              <span className="text-xs font-bold text-amber-600">{lifeExpectancy}岁</span>
            </div>
            <input
              type="range"
              min={75}
              max={100}
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(parseInt(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1">
              <span>75</span><span>100</span>
            </div>
          </div>

          {/* Annual Return */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-500">年化收益率</label>
              <span className="text-xs font-bold text-amber-600">{annualReturn}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1">
              <span>1%</span><span>12%</span>
            </div>
          </div>

          {/* Monthly Expense */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-500">每月支出</label>
              <span className="text-xs font-bold text-amber-600">{monthlyExpense.toLocaleString()}元</span>
            </div>
            <input
              type="range"
              min={1000}
              max={20000}
              step={500}
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(parseInt(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1">
              <span>1,000</span><span>20,000</span>
            </div>
          </div>

          {/* Monthly Invest */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-500">每月定投</label>
              <span className="text-xs font-bold text-amber-600">{monthlyInvest.toLocaleString()}元</span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={500}
              value={monthlyInvest}
              onChange={(e) => setMonthlyInvest(parseInt(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1">
              <span>0</span><span>10,000</span>
            </div>
          </div>

          {/* Retirement Age */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-500">退休年龄</label>
              <span className="text-xs font-bold text-amber-600">{retirementAge}岁</span>
            </div>
            <input
              type="range"
              min={55}
              max={70}
              value={retirementAge}
              onChange={(e) => setRetirementAge(parseInt(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1">
              <span>55</span><span>70</span>
            </div>
          </div>
        </div>

        {/* Back to Planner */}
        {plan && (
          <button
            onClick={() => navigate('/planner')}
            className="w-full bg-white border border-amber-200 hover:border-amber-400 text-amber-600 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            返回规划师调整方案
          </button>
        )}

        <p className="text-xs text-gray-400 text-center pb-8">
          此为模拟推演，不构成投资建议
        </p>
      </div>
    </div>
  );
}