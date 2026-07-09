import { create } from 'zustand';

export interface PlanResult {
  savings: { totalNeeded: number; monthlyInvest: number; yearsToRetirement: number };
  investment: { bondRatio: number; stockRatio: number; expectedReturn: number; description: string };
  insurance: { type: string; description: string }[];
  scenarios: {
    delayRetirement: { totalNeeded: number; monthlyInvest: number };
    increaseInvest: { totalNeeded: number; monthlyInvest: number };
    reduceExpense: { totalNeeded: number; monthlyInvest: number };
  };
}

interface PlanState {
  plan: PlanResult | null;
  planParams: {
    age: number;
    retirementAge: number;
    totalAssets: number;
    annualIncome: number;
    monthlyExpense: number;
    riskPreference: string;
  };
  setPlanParams: (params: Partial<PlanState['planParams']>) => void;
  setPlan: (plan: PlanResult | null) => void;
  generatePlan: () => Promise<PlanResult>;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plan: null,
  planParams: {
    age: 35,
    retirementAge: 60,
    totalAssets: 100000,
    annualIncome: 200000,
    monthlyExpense: 10000,
    riskPreference: 'moderate',
  },

  setPlanParams: (params) =>
    set((state) => ({ planParams: { ...state.planParams, ...params } })),

  setPlan: (plan) => set({ plan }),

  generatePlan: async () => {
    const { planParams } = get();
    const res = await fetch('/api/chat/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planParams),
    });
    const plan = await res.json();
    set({ plan });
    return plan;
  },
}));