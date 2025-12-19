/**
 * Insurance Engine
 * Calculates insurance deductions following Vietnam labor law
 * 
 * CRITICAL: Insurance is ONLY calculated on insuranceSalary (salary in labor contract)
 * NEVER on gross income or total income
 */

export interface InsuranceInput {
  insuranceSalary: number; // Mức lương đóng bảo hiểm (theo HĐLĐ)
  insuranceRate: number; // Tỷ lệ bảo hiểm (%) - typically 10.5%
}

export interface InsuranceResult {
  insuranceSalary: number;
  insuranceRate: number;
  insuranceDeduction: number;
  isValid: boolean;
  warnings: string[];
}

/**
 * Validate insurance salary
 * Ensures it's within legal bounds
 */
export function validateInsuranceSalary(
  insuranceSalary: number,
  grossIncome: number
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Insurance salary cannot be negative
  if (insuranceSalary < 0) {
    warnings.push('Mức lương đóng bảo hiểm không thể âm');
    return { valid: false, warnings };
  }

  // Insurance salary cannot exceed gross income (logical check)
  if (insuranceSalary > grossIncome) {
    warnings.push('Mức lương đóng bảo hiểm không thể lớn hơn tổng thu nhập');
  }

  // Regional minimum wage caps (2025)
  const MAX_INSURANCE_BASE = 36_000_000; // 20x minimum wage
  if (insuranceSalary > MAX_INSURANCE_BASE) {
    warnings.push(`Mức lương đóng BH vượt mức trần ${MAX_INSURANCE_BASE.toLocaleString('vi-VN')} VND`);
  }

  return { valid: warnings.length === 0, warnings };
}

/**
 * Calculate insurance deduction
 * 
 * @param input Insurance calculation input
 * @returns Insurance deduction amount and validation info
 */
export function calculateInsurance(input: InsuranceInput): InsuranceResult {
  const { insuranceSalary, insuranceRate } = input;

  // Validate rate
  if (insuranceRate < 0 || insuranceRate > 100) {
    return {
      insuranceSalary,
      insuranceRate,
      insuranceDeduction: 0,
      isValid: false,
      warnings: ['Tỷ lệ bảo hiểm phải trong khoảng 0-100%']
    };
  }

  // Calculate deduction
  const insuranceDeduction = insuranceSalary * (insuranceRate / 100);

  // Basic validation
  const validation = validateInsuranceSalary(insuranceSalary, insuranceSalary);

  return {
    insuranceSalary,
    insuranceRate,
    insuranceDeduction,
    isValid: validation.valid,
    warnings: validation.warnings
  };
}

/**
 * Calculate yearly insurance from monthly
 */
export function calculateYearlyInsurance(input: InsuranceInput): number {
  const monthlyResult = calculateInsurance(input);
  return monthlyResult.insuranceDeduction * 12;
}
