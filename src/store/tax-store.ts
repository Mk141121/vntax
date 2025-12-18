import { create } from 'zustand';
import { TaxInput, TaxResult } from '@/lib/tax/types';
import { calculateTax } from '@/lib/tax/calculator';
import { DEFAULT_INSURANCE_RATES } from '@/lib/tax/rules-2025';

interface TaxStore {
  // Input state
  grossIncome: number;
  dependents: number;
  insuranceRate: number;
  
  // Result state
  taxResult: TaxResult | null;
  
  // Actions
  setGrossIncome: (income: number) => void;
  setDependents: (count: number) => void;
  setInsuranceRate: (rate: number) => void;
  recalculate: () => void;
  reset: () => void;
}

// Initial values
const INITIAL_GROSS_INCOME = 20_000_000;
const INITIAL_DEPENDENTS = 0;
const INITIAL_INSURANCE_RATE = DEFAULT_INSURANCE_RATES.total;

// Helper to calculate tax
const computeTax = (input: TaxInput): TaxResult => {
  return calculateTax(input);
};

export const useTaxStore = create<TaxStore>((set, get) => ({
  // Initial state
  grossIncome: INITIAL_GROSS_INCOME,
  dependents: INITIAL_DEPENDENTS,
  insuranceRate: INITIAL_INSURANCE_RATE,
  taxResult: computeTax({
    grossIncome: INITIAL_GROSS_INCOME,
    dependents: INITIAL_DEPENDENTS,
    insuranceRate: INITIAL_INSURANCE_RATE,
  }),

  // Actions
  setGrossIncome: (income: number) => {
    set({ grossIncome: income });
    get().recalculate();
  },

  setDependents: (count: number) => {
    set({ dependents: Math.max(0, Math.floor(count)) });
    get().recalculate();
  },

  setInsuranceRate: (rate: number) => {
    set({ insuranceRate: rate });
    get().recalculate();
  },

  recalculate: () => {
    const { grossIncome, dependents, insuranceRate } = get();
    const result = computeTax({
      grossIncome,
      dependents,
      insuranceRate,
    });
    set({ taxResult: result });
  },

  reset: () => {
    set({
      grossIncome: INITIAL_GROSS_INCOME,
      dependents: INITIAL_DEPENDENTS,
      insuranceRate: INITIAL_INSURANCE_RATE,
    });
    get().recalculate();
  },
}));
