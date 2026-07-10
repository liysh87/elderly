import { create } from 'zustand';

interface UserState {
  name: string;
  age: number;
  dialect: string;
  riskPreference: string;
  totalAssets: number;
  monthlyPension: number;
  pensionDate: string;
  yesterdayReturn: number;
  yieldRate: number;
  monthlyChange: number;
  holdings: { name: string; type: string; marketValue: number; returnRate: number }[];
  transactions: { date: string; type: string; amount: number; status: string }[];
  largeFont: boolean;
  setUser: (data: Partial<UserState>) => void;
  fetchAssets: () => Promise<void>;
  fetchHoldings: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; age?: number; dialect?: string; riskPreference?: string }) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  name: '张阿姨',
  age: 58,
  dialect: 'mandarin',
  riskPreference: 'moderate',
  totalAssets: 680000,
  monthlyPension: 3200,
  pensionDate: '每月15日',
  yesterdayReturn: 128.50,
  yieldRate: 4.2,
  monthlyChange: 0.8,
  holdings: [],
  transactions: [],
  largeFont: false,

  setUser: (data) => set(data),

  fetchAssets: async () => {
    try {
      const res = await fetch('/api/user/assets');
      const data = await res.json();
      set(data);
    } catch (e) {
      console.error('Failed to fetch assets:', e);
    }
  },

  fetchHoldings: async () => {
    try {
      const res = await fetch('/api/user/holdings');
      const data = await res.json();
      set({ holdings: data.items });
    } catch (e) {
      console.error('Failed to fetch holdings:', e);
    }
  },

  fetchTransactions: async () => {
    try {
      const res = await fetch('/api/user/transactions');
      const data = await res.json();
      set({ transactions: data.items });
    } catch (e) {
      console.error('Failed to fetch transactions:', e);
    }
  },

  fetchProfile: async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      set(data);
    } catch (e) {
      console.error('Failed to fetch profile:', e);
    }
  },

  updateProfile: async (data) => {
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      set(data);
    } catch (e) {
      console.error('Failed to update profile:', e);
    }
  },
}));