import { TaxInput, TaxResult, MonthlyYearlyComparison } from './types';
import { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } from './rules-2025';
import { calculateProgressiveTax } from './progressive';

/**
 * Main tax calculator function
 * Calculates Vietnam Personal Income Tax based on 2025 rules
 * 
 * Calculation flow:
 * 1. Gross income
 * 2. - Insurance deduction
 * 3. - Personal deduction
 * 4. - Dependent deduction
 * 5. = Taxable income (minimum 0)
 * 6. Apply progressive tax brackets
 * 7. = Net income
 */
export function calculateTax(input: TaxInput): TaxResult {
  const { grossIncome, insuranceSalary, dependents, insuranceRate } = input;

  // Step 1: Calculate insurance deduction (PHẢI dùng insuranceSalary, KHÔNG dùng grossIncome)
  const insuranceDeduction = insuranceSalary * (insuranceRate / 100);

  // Step 2: Calculate personal and dependent deductions
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = DEPENDENT_DEDUCTION * dependents;

  // Step 3: Calculate total deductions
  const totalDeductions = insuranceDeduction + personalDeduction + dependentDeduction;

  // Step 4: Calculate taxable income (cannot be negative)
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Step 5: Apply progressive tax
  const { tax: totalTax, breakdown } = calculateProgressiveTax(taxableIncome);

  // Step 6: Calculate net income
  const netIncome = grossIncome - insuranceDeduction - totalTax;

  // Step 7: Calculate effective tax rate
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    insuranceSalary,
    insuranceDeduction,
    personalDeduction,
    dependentDeduction,
    totalDeductions,
    taxableIncome,
    totalTax,
    netIncome,
    effectiveRate,
    breakdown
  };
}

/**
 * Calculate both monthly and yearly tax
 */
export function calculateMonthlyAndYearly(input: TaxInput): MonthlyYearlyComparison {
  const monthly = calculateTax(input);
  
  return {
    monthly: {
      gross: monthly.grossIncome,
      insurance: monthly.insuranceDeduction,
      tax: monthly.totalTax,
      net: monthly.netIncome
    },
    yearly: {
      gross: monthly.grossIncome * 12,
      insurance: monthly.insuranceDeduction * 12,
      tax: monthly.totalTax * 12,
      net: monthly.netIncome * 12
    }
  };
}

/**
 * Validate tax input
 */
export function validateTaxInput(input: Partial<TaxInput>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (input.grossIncome === undefined || input.grossIncome < 0) {
    errors.push('Gross income must be a positive number');
  }

  if (input.dependents === undefined || input.dependents < 0) {
    errors.push('Dependents must be a positive number or zero');
  }

  if (input.insuranceRate === undefined || input.insuranceRate < 0 || input.insuranceRate > 100) {
    errors.push('Insurance rate must be between 0 and 100');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
