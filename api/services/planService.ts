export interface PlanParams {
  age: number;
  retirementAge: number;
  totalAssets: number;
  annualIncome: number;
  monthlyExpense: number;
  riskPreference: 'aggressive' | 'moderate' | 'conservative';
}

export interface PlanResult {
  savings: {
    totalNeeded: number;
    monthlyInvest: number;
    yearsToRetirement: number;
  };
  investment: {
    bondRatio: number;
    stockRatio: number;
    expectedReturn: number;
    description: string;
  };
  insurance: {
    type: string;
    description: string;
  }[];
  scenarios: {
    delayRetirement: { totalNeeded: number; monthlyInvest: number };
    increaseInvest: { totalNeeded: number; monthlyInvest: number };
    reduceExpense: { totalNeeded: number; monthlyInvest: number };
  };
}

function computePlanCore(params: PlanParams) {
  const { age, retirementAge, totalAssets, annualIncome, monthlyExpense, riskPreference } = params;

  const yearsToRetirement = retirementAge - age;
  const lifeExpectancy = 85;
  const retirementYears = lifeExpectancy - retirementAge;

  // Expected returns based on risk preference
  const returnRates: Record<string, number> = {
    conservative: 0.035,
    moderate: 0.05,
    aggressive: 0.07,
  };
  const expectedReturn = returnRates[riskPreference] || 0.05;

  // Social security replacement rate (simplified model)
  const socialSecurityReplacement = 0.35;
  const monthlySocialSecurity = annualIncome / 12 * socialSecurityReplacement;
  const monthlyGap = Math.max(0, monthlyExpense - monthlySocialSecurity);

  // Total needed at retirement using present value of annuity
  const monthlyRate = expectedReturn / 12;
  const totalMonths = retirementYears * 12;
  let totalNeededAtRetirement = 0;
  if (monthlyRate > 0) {
    totalNeededAtRetirement = monthlyGap * ((1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate);
  } else {
    totalNeededAtRetirement = monthlyGap * totalMonths;
  }

  // Future value of current assets
  const futureValueOfCurrent = totalAssets * Math.pow(1 + expectedReturn, yearsToRetirement);

  // Additional needed
  const additionalNeeded = Math.max(0, totalNeededAtRetirement - futureValueOfCurrent);

  // Monthly investment needed
  let monthlyInvest = 0;
  if (yearsToRetirement > 0 && monthlyRate > 0) {
    monthlyInvest = additionalNeeded * monthlyRate / (Math.pow(1 + monthlyRate, yearsToRetirement * 12) - 1);
  }

  return {
    totalNeeded: totalNeededAtRetirement,
    monthlyInvest,
    yearsToRetirement,
    expectedReturn,
    alloc: {
      conservative: { bondRatio: 80, stockRatio: 20 },
      moderate: { bondRatio: 60, stockRatio: 40 },
      aggressive: { bondRatio: 30, stockRatio: 70 },
    }[riskPreference],
  };
}

export function calculatePlan(params: PlanParams): PlanResult {
  const { age, retirementAge, totalAssets, annualIncome, monthlyExpense, riskPreference } = params;

  const core = computePlanCore(params);

  // Insurance recommendations
  const insuranceRecs: { type: string; description: string }[] = [];
  if (age < 50) {
    insuranceRecs.push({
      type: '百万医疗险',
      description: '建议配置百万医疗险，年保费约500-1000元，覆盖大病住院费用，补充社保报销不足的部分。',
    });
  }
  if (age >= 40) {
    insuranceRecs.push({
      type: '终身寿险',
      description: '建议配置增额终身寿险，既可获得身故保障，又能实现资产稳健增值，年缴保费约1-3万元。',
    });
  }
  if (age >= 55) {
    insuranceRecs.push({
      type: '养老年金险',
      description: '建议配置养老年金险，约定退休后每月领取固定金额，终身领取，对抗长寿风险。',
    });
  }

  // Scenarios (using computePlanCore to avoid infinite recursion)
  const delayRetirementCore = computePlanCore({ ...params, retirementAge: retirementAge + 5 });
  const increaseInvestCore = computePlanCore({ ...params, annualIncome: annualIncome * 1.2 });

  return {
    savings: {
      totalNeeded: Math.round(core.totalNeeded),
      monthlyInvest: Math.round(core.monthlyInvest),
      yearsToRetirement: core.yearsToRetirement,
    },
    investment: {
      bondRatio: core.alloc.bondRatio,
      stockRatio: core.alloc.stockRatio,
      expectedReturn: core.expectedReturn * 100,
      description: `基于您${riskPreference === 'conservative' ? '保守' : riskPreference === 'aggressive' ? '进取' : '稳健'}的风险偏好，建议配置${core.alloc.bondRatio}%债券基金 + ${core.alloc.stockRatio}%指数基金，预期年化收益${(core.expectedReturn * 100).toFixed(1)}%。`,
    },
    insurance: insuranceRecs,
    scenarios: {
      delayRetirement: {
        totalNeeded: Math.round(delayRetirementCore.totalNeeded),
        monthlyInvest: Math.round(delayRetirementCore.monthlyInvest),
      },
      increaseInvest: {
        totalNeeded: Math.round(increaseInvestCore.totalNeeded),
        monthlyInvest: Math.round(increaseInvestCore.monthlyInvest),
      },
      reduceExpense: {
        totalNeeded: Math.round(core.totalNeeded * 0.8),
        monthlyInvest: Math.round(Math.max(0, core.monthlyInvest * 0.8)),
      },
    },
  };
}

// Sandbox projection data
export function generateProjection(params: {
  age: number;
  retirementAge: number;
  totalAssets: number;
  monthlyInvest: number;
  annualReturn: number;
  monthlyExpense: number;
  lifeExpectancy: number;
}) {
  const { age, retirementAge, totalAssets, monthlyInvest, annualReturn, monthlyExpense, lifeExpectancy } = params;
  const monthlyRate = annualReturn / 100 / 12;
  const data: { age: number; asset: number; isRetired: boolean }[] = [];

  let asset = totalAssets;
  let currentAge = age;

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
}