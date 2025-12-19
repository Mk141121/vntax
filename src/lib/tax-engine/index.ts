/**
 * Tax Engine
 * Core tax calculation following Vietnam tax law 2025-2026
 * 
 * CRITICAL RULES:
 * 1. CONTRACT income: Subject to progressive tax after deductions
 * 2. NON_CONTRACT income: Flat 10% withholding, no deductions applied
 * 3. NEVER mix income types into single calculation
 */

export type IncomeType = 'CONTRACT' | 'NON_CONTRACT' | 'BONUS';

export interface IncomeSource {
  type: IncomeType;
  amount: number;
  name?: string;
}

export interface TaxEngineInput {
  incomeSources: IncomeSource[];
  insuranceDeduction: number; // Pre-calculated from insurance-engine
  personalDeduction: number; // 15.5M for 2025
  dependentDeduction: number; // 6.2M * dependents for 2025
}

export interface TaxBracketCalculation {
  bracket: number;
  from: number;
  to: number;
  taxableAmount: number;
  rate: number;
  tax: number;
}

export interface TaxEngineResult {
  contractIncome: number;
  nonContractIncome: number;
  bonusIncome: number;
  totalIncome: number;
  
  insuranceDeduction: number;
  personalDeduction: number;
  dependentDeduction: number;
  totalDeductions: number;
  
  taxableIncome: number; // Only for CONTRACT income
  progressiveTax: number; // Tax on CONTRACT income
  nonContractTax: number; // 10% flat on NON_CONTRACT
  bonusTax: number; // 10% flat on BONUS
  totalTax: number;
  
  netIncome: number;
  effectiveTaxRate: number;
  
  breakdown: TaxBracketCalculation[];
}

// Vietnam progressive tax brackets 2025-2026
const TAX_BRACKETS = [
  { upTo: 5_000_000, rate: 0.05 },
  { upTo: 10_000_000, rate: 0.10 },
  { upTo: 18_000_000, rate: 0.15 },
  { upTo: 32_000_000, rate: 0.20 },
  { upTo: 52_000_000, rate: 0.25 },
  { upTo: 80_000_000, rate: 0.30 },
  { upTo: Infinity, rate: 0.35 }
];

/**
 * Calculate progressive tax on taxable income
 */
function calculateProgressiveTax(taxableIncome: number): {
  tax: number;
  breakdown: TaxBracketCalculation[];
} {
  if (taxableIncome <= 0) {
    return { tax: 0, breakdown: [] };
  }

  let remainingIncome = taxableIncome;
  let totalTax = 0;
  const breakdown: TaxBracketCalculation[] = [];
  let previousLimit = 0;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    const bracketSize = bracket.upTo - previousLimit;
    const taxableInBracket = Math.min(remainingIncome, bracketSize);

    if (taxableInBracket <= 0) break;

    const bracketTax = taxableInBracket * bracket.rate;
    totalTax += bracketTax;

    breakdown.push({
      bracket: i + 1,
      from: previousLimit,
      to: previousLimit + taxableInBracket,
      taxableAmount: taxableInBracket,
      rate: bracket.rate,
      tax: bracketTax
    });

    remainingIncome -= taxableInBracket;
    previousLimit = bracket.upTo;

    if (remainingIncome <= 0) break;
  }

  return { tax: totalTax, breakdown };
}

/**
 * Main tax calculation engine
 */
export function calculateTax(input: TaxEngineInput): TaxEngineResult {
  const { incomeSources, insuranceDeduction, personalDeduction, dependentDeduction } = input;

  // Separate income by type
  let contractIncome = 0;
  let nonContractIncome = 0;
  let bonusIncome = 0;

  for (const source of incomeSources) {
    switch (source.type) {
      case 'CONTRACT':
        contractIncome += source.amount;
        break;
      case 'NON_CONTRACT':
        nonContractIncome += source.amount;
        break;
      case 'BONUS':
        bonusIncome += source.amount;
        break;
    }
  }

  const totalIncome = contractIncome + nonContractIncome + bonusIncome;

  // Calculate total deductions (ONLY apply to CONTRACT income)
  const totalDeductions = insuranceDeduction + personalDeduction + dependentDeduction;

  // Calculate taxable income for CONTRACT income only
  const taxableIncome = Math.max(0, contractIncome - totalDeductions);

  // Calculate progressive tax on CONTRACT income
  const { tax: progressiveTax, breakdown } = calculateProgressiveTax(taxableIncome);

  // Calculate flat 10% tax on NON_CONTRACT and BONUS income
  const nonContractTax = nonContractIncome * 0.10;
  const bonusTax = bonusIncome * 0.10;

  // Total tax
  const totalTax = progressiveTax + nonContractTax + bonusTax;

  // Net income = Total income - Insurance - All taxes
  const netIncome = totalIncome - insuranceDeduction - totalTax;

  // Effective tax rate
  const effectiveTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

  return {
    contractIncome,
    nonContractIncome,
    bonusIncome,
    totalIncome,
    
    insuranceDeduction,
    personalDeduction,
    dependentDeduction,
    totalDeductions,
    
    taxableIncome,
    progressiveTax,
    nonContractTax,
    bonusTax,
    totalTax,
    
    netIncome,
    effectiveTaxRate,
    
    breakdown
  };
}
