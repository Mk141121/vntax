/**
 * Tax Adapter
 * Bridge between existing UI state and new engine architecture
 * 
 * This adapter allows the existing UI to work without changes
 * while using the new, correct tax calculation engines
 */

import { TaxInput, TaxResult, TaxBreakdown } from './tax/types';
import { calculateInsurance, InsuranceInput, InsuranceResult } from './insurance-engine';
import { calculateTax, TaxEngineInput, IncomeSource } from './tax-engine';
import { generateTaxExplanation } from './explanation-engine';
import { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } from './tax/rules-2025';

/**
 * Adapter to calculate tax using new engine
 * Maps old TaxInput format to new engine format and back
 * 
 * @param input Tax input from existing UI
 * @returns Tax result in existing format
 */
export function calculateTaxAdapter(input: TaxInput): TaxResult {
  const { grossIncome, insuranceSalary, dependents, insuranceRate } = input;

  // Step 1: Calculate insurance using insurance-engine
  const insuranceInput: InsuranceInput = {
    insuranceSalary,
    insuranceRate
  };
  const insuranceResult: InsuranceResult = calculateInsurance(insuranceInput);

  // Step 2: Prepare income sources (treat all as CONTRACT for existing UI)
  // The existing UI only has single income field, so we treat it as CONTRACT income
  const incomeSources: IncomeSource[] = [
    {
      type: 'CONTRACT',
      amount: grossIncome,
      name: 'Lương chính'
    }
  ];

  // Step 3: Calculate tax using tax-engine
  const taxEngineInput: TaxEngineInput = {
    incomeSources,
    insuranceDeduction: insuranceResult.insuranceDeduction,
    personalDeduction: PERSONAL_DEDUCTION,
    dependentDeduction: DEPENDENT_DEDUCTION * dependents
  };
  const taxEngineResult = calculateTax(taxEngineInput);

  // Step 4: Generate explanation
  const explanation = generateTaxExplanation(taxEngineResult, insuranceResult);

  // Step 5: Map engine result back to UI format
  const breakdown: TaxBreakdown[] = taxEngineResult.breakdown.map((b) => ({
    bracket: b.bracket,
    from: b.from,
    to: b.to,
    taxableAmount: b.taxableAmount,
    rate: b.rate,
    tax: b.tax
  }));

  const result: TaxResult = {
    grossIncome: taxEngineResult.totalIncome,
    insuranceSalary: insuranceResult.insuranceSalary,
    insuranceDeduction: taxEngineResult.insuranceDeduction,
    personalDeduction: taxEngineResult.personalDeduction,
    dependentDeduction: taxEngineResult.dependentDeduction,
    totalDeductions: taxEngineResult.totalDeductions,
    taxableIncome: taxEngineResult.taxableIncome,
    totalTax: taxEngineResult.totalTax,
    netIncome: taxEngineResult.netIncome,
    effectiveRate: taxEngineResult.effectiveTaxRate,
    breakdown
  };

  // Attach explanation as metadata (can be used by UI if needed)
  (result as any).explanation = explanation;
  (result as any).engineResult = taxEngineResult;
  (result as any).insuranceResult = insuranceResult;

  return result;
}

/**
 * Validate input before calculation
 */
export function validateTaxInput(input: Partial<TaxInput>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (input.grossIncome === undefined || input.grossIncome < 0) {
    errors.push('Thu nhập phải là số dương');
  }

  if (input.insuranceSalary === undefined || input.insuranceSalary < 0) {
    errors.push('Mức lương đóng bảo hiểm phải là số dương');
  }

  if (input.dependents === undefined || input.dependents < 0) {
    errors.push('Số người phụ thuộc phải là số dương hoặc 0');
  }

  if (input.insuranceRate === undefined || input.insuranceRate < 0 || input.insuranceRate > 100) {
    errors.push('Tỷ lệ bảo hiểm phải từ 0 đến 100%');
  }

  // Additional validation: insurance salary should not exceed gross income
  if (input.insuranceSalary && input.grossIncome && input.insuranceSalary > input.grossIncome) {
    errors.push('Mức lương đóng bảo hiểm không thể lớn hơn tổng thu nhập');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
