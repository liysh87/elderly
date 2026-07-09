import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import {
  ArrowLeft, User, Phone, Mail, Calendar, Globe,
  Shield, ChevronRight, Bell, Moon, Sun, Volume2, Headphones
} from 'lucide-react';

const dialectOptions = [
  { value: 'mandarin', label: '普通话', flag: '🗣️' },
  { value: 'sichuan', label: '四川话', flag: '🌶️' },
  { value: 'dongbei', label: '东北话', flag: '❄️' },
  { value: 'cantonese', label: '粤语', flag: '🏮' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { name, age, dialect, riskPreference, largeFont, setUser, updateProfile } = useUserStore();
  const [showDialect, setShowDialect] = useState(false);
  const [largeFontLocal, setLargeFontLocal] = useState(largeFont);
  const [highContrast, setHighContrast] = useState(false);

  const handleDialectChange = async (d: string) => {
    await updateProfile({ dialect: d });
    setShowDialect(false);
  };

  const handleLargeFontToggle = () => {
    const newVal = !largeFontLocal;
    setLargeFontLocal(newVal);
    setUser({ largeFont: newVal });
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-amber-50">
          <ArrowLeft size={22} className="text-gray-600" />
        </button>
        <h1 className="font-semibold text-gray-800">我的</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-50 p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <User size={28} className="text-amber-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-lg">{name}</h2>
            <div className="flex gap-4 mt-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> {age}岁
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Shield size={12} /> {riskPreference === 'conservative' ? '保守型' : riskPreference === 'aggressive' ? '进取型' : '稳健型'}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-50 overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-50">
            <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Globe size={14} /> 语言设置
            </h3>
          </div>
          <button
            onClick={() => setShowDialect(!showDialect)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-amber-500" />
              <div className="text-left">
                <p className="text-sm text-gray-700">方言选择</p>
                <p className="text-xs text-gray-400">
                  {dialectOptions.find(d => d.value === dialect)?.flag} {dialectOptions.find(d => d.value === dialect)?.label}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>

          {showDialect && (
            <div className="px-5 pb-4 space-y-2">
              {dialectOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDialectChange(opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    dialect === opt.value
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-lg">{opt.flag}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                  {dialect === opt.value && (
                    <span className="ml-auto text-xs bg-amber-200 px-2 py-0.5 rounded-full">当前</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-50 overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-50">
            <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Sun size={14} /> 显示设置
            </h3>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔍</span>
              <div>
                <p className="text-sm text-gray-700">大字模式</p>
                <p className="text-xs text-gray-400">全局字体放大，方便阅读</p>
              </div>
            </div>
            <button
              onClick={handleLargeFontToggle}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                largeFontLocal ? 'bg-amber-500' : 'bg-gray-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${
                largeFontLocal ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="px-5 py-4 flex items-center justify-between border-t border-amber-50">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-700">高对比度主题</p>
                <p className="text-xs text-gray-400">深色背景，适合视力障碍用户</p>
              </div>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                highContrast ? 'bg-amber-500' : 'bg-gray-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-50 overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-50">
            <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Shield size={14} /> 安全设置
            </h3>
          </div>
          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-amber-50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">消息通知</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-amber-50 transition-colors border-t border-amber-50">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">隐私设置</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>

        {/* Advisor */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
              <Headphones size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">预约人工顾问</p>
              <p className="text-xs text-gray-500">一对一深度规划服务</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-amber-400" />
        </div>

        {/* Version */}
        <p className="text-center text-xs text-gray-300 pb-8">
          安颐伴 v1.0.0 · 您的AI养老管家
        </p>
      </div>
    </div>
  );
}