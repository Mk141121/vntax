import { create } from 'zustand';
import { TaxInput, TaxResult, CalculationMode, MonthlyIncomeData, YearlyTaxResult } from '@/lib/tax/types';
import { calculateTax } from '@/lib/tax/calculator';
import { calculateYearlyTaxFromMonthly, createDefaultMonthlyData } from '@/lib/tax/calculator-monthly';
import { DEFAULT_INSURANCE_RATES } from '@/lib/tax/rules-2025';

interface TaxStore {
  // Calculation mode
  calculationMode: CalculationMode;
  
  // Fixed income mode - Input state
  grossIncome: number;
  insuranceSalary: number;
  dependents: number;
  insuranceRate: number;
  
  // Monthly income mode - Input state
  monthlyData: MonthlyIncomeData[];
  
  // Result state
  taxResult: TaxResult | null;
  yearlyResult: YearlyTaxResult | null;
  
  // Actions
  setCalculationMode: (mode: CalculationMode) => void;
  setGrossIncome: (income: number) => void;
  setInsuranceSalary: (salary: number) => void;
  setDependents: (count: number) => void;
  setInsuranceRate: (rate: number) => void;
  setMonthlyData: (data: MonthlyIncomeData[]) => void;
  updateMonthData: (month: number, data: Partial<MonthlyIncomeData>) => void;
  copyFromPreviousMonth: (fromMonth: number) => void;
  calculate: () => void;
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
  calculationMode: 'fixed',
  grossIncome: INITIAL_GROSS_INCOME,
  insuranceSalary: INITIAL_GROSS_INCOME,
  dependents: INITIAL_DEPENDENTS,
  insuranceRate: INITIAL_INSURANCE_RATE,
  monthlyData: createDefaultMonthlyData(),
  taxResult: computeTax({
    grossIncome: INITIAL_GROSS_INCOME,
    insuranceSalary: INITIAL_GROSS_INCOME,
    dependents: INITIAL_DEPENDENTS,
    insuranceRate: INITIAL_INSURANCE_RATE,
  }),
  yearlyResult: null,

  // Actions
  setCalculationMode: (mode: CalculationMode) => {
    set({ calculationMode: mode });
    get().recalculate();
  },

  setGrossIncome: (income: number) => {
    set({ grossIncome: income });
  },

  setInsuranceSalary: (salary: number) => {
    set({ insuranceSalary: salary });
  },

  setDependents: (count: number) => {
    set({ dependents: Math.max(0, Math.floor(count)) });
  },

  setInsuranceRate: (rate: number) => {
    set({ insuranceRate: rate });
  },

  setMonthlyData: (data: MonthlyIncomeData[]) => {
    set({ monthlyData: data });
  },

  updateMonthData: (month: number, data: Partial<MonthlyIncomeData>) => {
    const { monthlyData } = get();
    const newData = monthlyData.map((m) =>
      m.month === month ? { ...m, ...data } : m
    );
    set({ monthlyData: newData });
  },

  copyFromPreviousMonth: (fromMonth: number) => {
    const { monthlyData } = get();
    if (fromMonth < 1 || fromMonth > 12) return;
    
    const sourceData = monthlyData[fromMonth - 1];
    const newData = monthlyData.map((m, i) =>
      i >= fromMonth ? {
        ...m,
        grossIncome: sourceData.grossIncome,
        insuranceSalary: sourceData.insuranceSalary,
      } : m
    );
    
    set({ monthlyData: newData });
  },

  calculate: () => {
    const { calculationMode, grossIncome, insuranceSalary, dependents, insuranceRate, monthlyData } = get();
    
    if (calculationMode === 'fixed') {
      const result = computeTax({
        grossIncome,
        insuranceSalary,
        dependents,
        insuranceRate,
      });
      set({ taxResult: result, yearlyResult: null });
    } else {
      const yearlyResult = calculateYearlyTaxFromMonthly(monthlyData, dependents, insuranceRate);
      set({ yearlyResult, taxResult: null });
    }
  },

  recalculate: () => {
    get().calculate();
  },

  reset: () => {
    set({
      calculationMode: 'fixed',
      grossIncome: INITIAL_GROSS_INCOME,
      insuranceSalary: INITIAL_GROSS_INCOME,
      dependents: INITIAL_DEPENDENTS,
      insuranceRate: INITIAL_INSURANCE_RATE,
      monthlyData: createDefaultMonthlyData(),
    });
    get().recalculate();
  },
}));
