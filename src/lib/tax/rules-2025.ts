import { TaxBracket } from './types';

/**
 * Vietnam Personal Income Tax Rules for 2025
 * Based on current Vietnamese PIT law
 */

// Progressive tax brackets (lũy tiến từng phần)
export const TAX_BRACKETS: TaxBracket[] = [
  { upTo: 5_000_000, rate: 0.05 },
  { upTo: 10_000_000, rate: 0.10 },
  { upTo: 18_000_000, rate: 0.15 },
  { upTo: 32_000_000, rate: 0.20 },
  { upTo: 52_000_000, rate: 0.25 },
  { upTo: 80_000_000, rate: 0.30 },
  { upTo: Infinity, rate: 0.35 }
];

// Deductions (monthly amounts in VND)
export const PERSONAL_DEDUCTION = 11_000_000; // VND per month
export const DEPENDENT_DEDUCTION = 4_400_000; // VND per person per month

// Default insurance rates (employee side)
export const DEFAULT_INSURANCE_RATES = {
  social: 8.0,        // BHXH - Social Insurance
  health: 1.5,        // BHYT - Health Insurance
  unemployment: 1.0,  // BHTN - Unemployment Insurance
  total: 10.5         // Total default
};

// Insurance rate limits
export const INSURANCE_RATE_MIN = 0;
export const INSURANCE_RATE_MAX = 15;

// Labels and descriptions
export const TAX_LABELS = {
  personalDeduction: 'Personal Deduction',
  dependentDeduction: 'Dependent Deduction',
  insuranceDeduction: 'Mandatory Insurance',
  grossIncome: 'Gross Income',
  netIncome: 'Net Income',
  totalTax: 'Income Tax',
  taxableIncome: 'Taxable Income'
};

export const TAX_DESCRIPTIONS = {
  personalDeduction: 'Standard personal deduction: 11,000,000 VND/month',
  dependentDeduction: 'Each dependent: 4,400,000 VND/month',
  insuranceDeduction: 'Social (8%) + Health (1.5%) + Unemployment (1%) = 10.5%',
  grossIncome: 'Your total monthly income before any deductions',
  dependents: 'Number of dependents (spouse, children, parents)',
  insuranceRate: 'Total mandatory insurance rate (adjustable)'
};
